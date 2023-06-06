import { getRandomString } from 'billd-utils';
import { Ref, nextTick, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchRtcV1Play } from '@/api/srs';
import { useFlvPlay } from '@/hooks/use-play';
import {
  DanmuMsgTypeEnum,
  IAdminIn,
  ICandidate,
  IDanmu,
  ILive,
  ILiveUser,
  IOffer,
  MediaTypeEnum,
} from '@/interface';
import { SRSWebRTCClass } from '@/network/srsWebRtc';
import { WebRTCClass } from '@/network/webRtc';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  prettierReceiveWebsocket,
} from '@/network/webSocket';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';

export function usePull({
  localVideoRef,
  remoteVideoRef,
  isSRS,
  isFlv,
}: {
  localVideoRef: Ref<HTMLVideoElement[]>;
  remoteVideoRef: Ref<HTMLVideoElement | undefined>;
  isSRS?: boolean;
  isFlv?: boolean;
}) {
  const route = useRoute();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const heartbeatTimer = ref();
  const roomId = ref(route.params.roomId as string);
  const roomName = ref('');
  const userName = ref('');
  const userAvatar = ref('');
  const streamurl = ref('');
  const flvurl = ref('');
  const danmuStr = ref('');
  const balance = ref('0.00');
  const damuList = ref<IDanmu[]>([]);
  const liveUserList = ref<ILiveUser[]>([]);
  const isDone = ref(false);
  const roomNoLive = ref(false);
  const localStream = ref();
  const sidebarList = ref<
    {
      socketId: string;
    }[]
  >([]);

  const track = reactive({
    audio: true,
    video: true,
  });
  const giftList = ref([
    { name: '鲜花', ico: '', price: '免费' },
    { name: '肥宅水', ico: '', price: '2元' },
    { name: '小鸡腿', ico: '', price: '3元' },
    { name: '大鸡腿', ico: '', price: '5元' },
    { name: '一杯咖啡', ico: '', price: '10元' },
  ]);
  const offerSended = ref(new Set());
  const hooksRtcMap = ref(new Set());
  const sender = ref();

  const allMediaTypeList = {
    [MediaTypeEnum.camera]: {
      type: MediaTypeEnum.camera,
      txt: '摄像头',
    },
    [MediaTypeEnum.screen]: {
      type: MediaTypeEnum.screen,
      txt: '窗口',
    },
  };
  const currMediaTypeList = ref<
    {
      type: MediaTypeEnum;
      txt: string;
    }[]
  >([]);
  const currMediaType = ref<{
    type: MediaTypeEnum;
    txt: string;
  }>();

  onUnmounted(() => {
    clearInterval(heartbeatTimer.value);
  });

  /** 摄像头 */
  async function startGetUserMedia() {
    if (!localStream.value) {
      // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
      const event = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('getUserMedia成功', event);
      currMediaType.value = allMediaTypeList[MediaTypeEnum.camera];
      currMediaTypeList.value.push(allMediaTypeList[MediaTypeEnum.camera]);
      // localVideoRef.value.forEach((item) => {
      //   item.srcObject = event;
      // });
      localStream.value = event;
    }
  }

  /** 窗口 */
  async function startGetDisplayMedia() {
    if (!localStream.value) {
      // WARN navigator.mediaDevices.getDisplayMedia在localhost和https才能用，http://192.168.1.103:8000局域网用不了
      const event = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const audio = event.getAudioTracks();
      const video = event.getVideoTracks();
      track.audio = !!audio.length;
      track.video = !!video.length;
      console.log('getDisplayMedia成功', event);
      currMediaType.value = allMediaTypeList[MediaTypeEnum.screen];
      currMediaTypeList.value.push(allMediaTypeList[MediaTypeEnum.screen]);
      localStream.value = event;
    }
  }

  watch(
    [
      () => userStore.userInfo,
      () => networkStore.wsMap.get(roomId.value)?.socketIo?.connected,
    ],
    ([userInfo, connected]) => {
      if (userInfo) {
        balance.value = userInfo.wallet?.balance || '0.00';
      }
      if (userInfo && connected) {
        const instance = networkStore.wsMap.get(roomId.value);
        if (!instance) return;
        instance.send({
          msgType: WsMsgTypeEnum.updateJoinInfo,
          data: {
            userInfo: userStore.userInfo,
          },
        });
      }
    }
  );

  function initPull() {
    console.warn('开始new WebSocketClass');
    const ws = new WebSocketClass({
      roomId: roomId.value,
      url:
        process.env.NODE_ENV === 'development'
          ? 'ws://localhost:4300'
          : 'wss://live.hsslive.cn',
      isAdmin: false,
    });
    ws.update();
    initReceive();
    remoteVideoRef.value?.addEventListener('loadstart', () => {
      console.warn('视频流-loadstart');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.rtcStatus.loadstart = true;
      rtc.update();
    });

    remoteVideoRef.value?.addEventListener('loadedmetadata', () => {
      console.warn('视频流-loadedmetadata');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.rtcStatus.loadedmetadata = true;
      rtc.update();
    });
  }

  function handleHeartbeat() {
    heartbeatTimer.value = setInterval(() => {
      const instance = networkStore.wsMap.get(roomId.value);
      if (!instance) return;
      instance.send({
        msgType: WsMsgTypeEnum.heartbeat,
      });
    }, 1000 * 5);
  }

  function closeWs() {
    const instance = networkStore.wsMap.get(roomId.value);
    instance?.close();
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      rtc.close();
    });
  }

  function getSocketId() {
    return networkStore.wsMap.get(roomId.value!)?.socketIo?.id || '-1';
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send({
      msgType: WsMsgTypeEnum.join,
      data: { userInfo: userStore.userInfo },
    });
  }

  function addTransceiver(socketId: string) {
    if (!localStream.value) return;
    if (socketId !== getSocketId()) {
      localStream.value.getTracks().forEach((track) => {
        const rtc = networkStore.getRtcMap(`${roomId.value}___${socketId}`);
        rtc?.addTransceiver(track, localStream.value);
      });
    }
  }

  function addTrack() {
    if (!localStream.value) return;
    liveUserList.value.forEach((item) => {
      if (item.socketId !== getSocketId()) {
        localStream.value.getTracks().forEach((track) => {
          const rtc = networkStore.getRtcMap(
            `${roomId.value}___${item.socketId}`
          );
          console.log(rtc, track, localStream.value, 9998);
          rtc?.addTrack(track, localStream.value);
        });
      }
    });
  }

  async function sendOffer({
    sender,
    receiver,
  }: {
    sender: string;
    receiver: string;
  }) {
    if (isDone.value) return;
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const rtc = networkStore.getRtcMap(`${roomId.value}___${receiver}`);
    if (!rtc) return;
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp);
    instance.send({
      msgType: WsMsgTypeEnum.offer,
      data: { sdp, sender, receiver },
    });
  }

  async function batchSendOffer(socketId: string) {
    await nextTick(async () => {
      if (!offerSended.value.has(socketId) && socketId !== getSocketId()) {
        hooksRtcMap.value.add(await startNewWebRtc({ receiver: socketId }));
        await addTransceiver(socketId);
        console.log('执行sendOffer', {
          sender: getSocketId(),
          receiver: socketId,
        });
        sendOffer({ sender: getSocketId(), receiver: socketId });
        offerSended.value.add(socketId);
      }
    });
  }

  function addVideo() {
    sidebarList.value.push({ socketId: getSocketId() });
    nextTick(() => {
      liveUserList.value.forEach(async (item) => {
        if (item.socketId === getSocketId()) {
          localVideoRef.value[getSocketId()].srcObject = localStream.value;
        }
        if (!offerSended.value.has(item.socketId)) {
          hooksRtcMap.value.add(
            await startNewWebRtc({
              receiver: item.socketId,
              videoEl: localVideoRef.value[item.socketId],
              // videoEl: localVideoRef.value[sender.value],
            })
          );
          await addTransceiver(item.socketId);
          console.log('执行sendOffer', {
            sender: getSocketId(),
            receiver: item.socketId,
          });
          sendOffer({ sender: getSocketId(), receiver: item.socketId });
          offerSended.value.add(item.socketId);
        }
      });
    });
  }

  /** 原生的webrtc时，receiver必传 */
  async function startNewWebRtc({
    receiver,
    videoEl = remoteVideoRef.value!,
  }: {
    receiver?: string;
    videoEl?: HTMLVideoElement;
  }) {
    if (isSRS) {
      console.warn('开始new SRSWebRTCClass', getSocketId());
      const rtc = new SRSWebRTCClass({
        roomId: `${roomId.value}___${getSocketId()}`,
        videoEl,
      });
      rtc.rtcStatus.joined = true;
      rtc.update();
      if (track.video) {
        rtc.peerConnection?.addTransceiver('video', { direction: 'recvonly' });
      }
      if (track.audio) {
        rtc.peerConnection?.addTransceiver('audio', { direction: 'recvonly' });
      }
      try {
        const offer = await rtc.createOffer();
        if (!offer) return;
        await rtc.setLocalDescription(offer);
        const res: any = await fetchRtcV1Play({
          api: `${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:1985'
              : 'https://live.hsslive.cn/srs'
          }/rtc/v1/play/`,
          clientip: null,
          sdp: offer.sdp!,
          streamurl: streamurl.value,
          tid: getRandomString(10),
        });
        await rtc.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: res.sdp })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.warn('开始new WebRTCClass');
      const rtc = new WebRTCClass({
        roomId: `${roomId.value}___${receiver!}`,
        videoEl,
      });
      return rtc;
    }
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      sendDanmu();
    }
  }

  function sendDanmu() {
    if (!danmuStr.value.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const danmu: IDanmu = {
      socketId: getSocketId(),
      userInfo: userStore.userInfo,
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
    };
    instance.send({
      msgType: WsMsgTypeEnum.message,
      data: danmu,
    });
    damuList.value.push(danmu);
    danmuStr.value = '';
  }

  function initReceive() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance?.socketIo) return;
    // websocket连接成功
    instance.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.connect);
      handleHeartbeat();
      if (!instance) return;
      instance.status = WsConnectStatusEnum.connect;
      instance.update();
      sendJoin();
    });

    // websocket连接断开
    instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.disconnect);
      if (!instance) return;
      instance.status = WsConnectStatusEnum.disconnect;
      instance.update();
    });

    // 收到offer
    instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.offer,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS) return;
      if (!instance) return;
      if (data.data.receiver === getSocketId()) {
        if (!data.isAdmin) {
          sidebarList.value.push({ socketId: data.data.sender });
        }
        await nextTick(async () => {
          console.log('收到offer，这个offer是发给我的');
          sender.value = data.data.sender;
          const rtc = await startNewWebRtc({
            receiver: data.data.sender,
            videoEl: data.isAdmin
              ? remoteVideoRef.value
              : localVideoRef.value[data.data.sender],
          });
          if (rtc) {
            await rtc.setRemoteDescription(data.data.sdp);
            const sdp = await rtc.createAnswer();
            await rtc.setLocalDescription(sdp);
            instance.send({
              msgType: WsMsgTypeEnum.answer,
              data: {
                sdp,
                sender: getSocketId(),
                receiver: data.data.sender,
              },
            });
          }
        });
      } else {
        console.log('收到offer，但是这个offer不是发给我的');
      }
    });

    // 收到answer
    instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.answer,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS) return;
      if (!instance) return;
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socketId}`);
      if (!rtc) return;
      rtc.rtcStatus.answer = true;
      rtc.update();
      if (data.data.receiver === getSocketId()) {
        console.log('收到answer，这个answer是发给我的');
        await rtc.setRemoteDescription(data.data.sdp);
      } else {
        console.log('收到answer，但这个answer不是发给我的');
      }
    });

    // 收到candidate
    instance.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.candidate,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS) return;
      if (!instance) return;
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socketId}`);
      if (!rtc) return;
      if (data.data.receiver === getSocketId()) {
        console.log('是发给我的candidate');
        const candidate = new RTCIceCandidate({
          sdpMid: data.data.sdpMid,
          sdpMLineIndex: data.data.sdpMLineIndex,
          candidate: data.data.candidate,
        });
        rtc.peerConnection
          ?.addIceCandidate(candidate)
          .then(() => {
            console.log('candidate成功');
          })
          .catch((err) => {
            console.error('candidate失败', err);
          });
      } else {
        console.log('不是发给我的candidate');
      }
    });

    // 管理员正在直播
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data: IAdminIn) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomLiveing, data);
      if (isSRS && !isFlv) {
        startNewWebRtc({});
      }
    });

    // 管理员不在直播
    instance.socketIo.on(WsMsgTypeEnum.roomNoLive, (data: IAdminIn) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomNoLive, data);
      roomNoLive.value = true;
      closeRtc();
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.liveUser, data);
      if (!instance) return;
      liveUserList.value = data.map((item) => ({
        avatar: 'red',
        socketId: item.id,
      }));
      // batchSendOffer();
    });

    // 收到用户发送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.message, data);
      if (!instance) return;
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.danmu,
        socketId: data.socketId,
        userInfo: data.data.userInfo,
        msg: data.data.msg,
      };
      damuList.value.push(danmu);
    });

    // 用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.joined, (data: { data: ILive }) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.joined, data);
      roomName.value = data.data.live_room?.roomName!;
      userName.value = data.data.user?.username!;
      userAvatar.value = data.data.user?.avatar!;
      track.audio = data.data.track_audio!;
      track.video = data.data.track_video!;
      streamurl.value = data.data.streamurl!;
      flvurl.value = data.data.flvurl!;
      if (isFlv) {
        useFlvPlay(flvurl.value, remoteVideoRef.value!);
      }
      instance.send({ msgType: WsMsgTypeEnum.getLiveUser });
    });

    // 其他用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.otherJoin, data);
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.otherJoin,
        socketId: data.data.socketId,
        userInfo: data.data.userInfo,
        msg: '',
      };
      damuList.value.push(danmu);
      batchSendOffer(data.data.socketId);
    });

    // 用户离开房间
    instance.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.leave, data);
      if (!instance) return;
      instance.send({
        msgType: WsMsgTypeEnum.leave,
        data: { roomId: instance.roomId },
      });
    });

    // 用户离开房间完成
    instance.socketIo.on(WsMsgTypeEnum.leaved, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.leaved, data);
      if (!instance) return;
      const res = liveUserList.value.filter(
        (item) => item.socketId !== data.socketId
      );
      liveUserList.value = res;
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.userLeaved,
        socketId: data.socketId,
        userInfo: data.data.userInfo,
        msg: '',
      };
      damuList.value.push(danmu);
    });
  }

  return {
    initPull,
    closeWs,
    closeRtc,
    getSocketId,
    keydownDanmu,
    sendDanmu,
    batchSendOffer,
    startGetUserMedia,
    startGetDisplayMedia,
    addTrack,
    addVideo,
    balance,
    roomName,
    userName,
    userAvatar,
    roomNoLive,
    damuList,
    giftList,
    liveUserList,
    danmuStr,
    localStream,
    sender,
    sidebarList,
  };
}
