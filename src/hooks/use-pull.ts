import { getRandomString } from 'billd-utils';
import { Ref, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchRtcV1Play } from '@/api/srs';
import { useFlvPlay } from '@/hooks/use-play';
import {
  DanmuMsgTypeEnum,
  IAdminIn,
  ICandidate,
  IDanmu,
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
  const streamurl = ref('');
  const flvurl = ref('');
  const danmuStr = ref('');
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
    }, 1000 * 30);
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

  function addTransceiver() {
    if (!localStream.value) return;
    liveUserList.value.forEach((item) => {
      if (item.socketId !== getSocketId()) {
        localStream.value.getTracks().forEach((track) => {
          const rtc = networkStore.getRtcMap(
            `${roomId.value}___${item.socketId}`
          );
          rtc?.addTransceiver(track, localStream.value);
        });
      }
    });
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

  function batchSendOffer() {
    liveUserList.value.forEach(async (item) => {
      if (
        !offerSended.value.has(item.socketId) &&
        item.socketId !== getSocketId()
      ) {
        hooksRtcMap.value.add(
          await startNewWebRtc({ receiver: item.socketId })
        );
        await addTransceiver();
        console.warn('new WebRTCClass完成');
        console.log('执行sendOffer', {
          sender: getSocketId(),
          receiver: item.socketId,
        });
        sendOffer({ sender: getSocketId(), receiver: item.socketId });
        offerSended.value.add(item.socketId);
      }
    });
  }

  async function addVideo() {
    const socketId = sender.value;
    localVideoRef.value[socketId].srcObject = localStream.value;
    hooksRtcMap.value.add(
      await startNewWebRtc({
        receiver: socketId,
        videoEl: localVideoRef.value[socketId],
      })
    );
    await addTransceiver();
    console.warn('new WebRTCClass完成');
    console.log('执行sendOffer', {
      sender: getSocketId(),
      receiver: socketId,
    });
    sendOffer({ sender: getSocketId(), receiver: socketId });
    offerSended.value.add(socketId);
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
        videoEl: remoteVideoRef.value!,
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
      console.log('【websocket】websocket连接成功');
      if (!instance) return;
      instance.status = WsConnectStatusEnum.connect;
      instance.update();
      sendJoin();
      handleHeartbeat();
    });

    // websocket连接断开
    instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      console.log('【websocket】websocket连接断开');
      if (!instance) return;
      instance.status = WsConnectStatusEnum.disconnect;
      instance.update();
    });

    // 收到offer
    instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
      console.warn('【websocket】收到offer', data);
      if (isSRS) return;
      if (!instance) return;
      if (data.data.receiver === getSocketId()) {
        console.log('收到offer，这个offer是发给我的');
        sidebarList.value.push({ socketId: data.data.sender });
        sender.value = data.data.sender;
        const rtc = await startNewWebRtc({ receiver: data.data.sender });
        if (rtc) {
          await rtc.setRemoteDescription(data.data.sdp);
          const sdp = await rtc.createAnswer();
          await rtc.setLocalDescription(sdp);
          instance.send({
            msgType: WsMsgTypeEnum.answer,
            data: { sdp, sender: getSocketId(), receiver: data.data.sender },
          });
        }
      } else {
        console.log('收到offer，但是这个offer不是发给我的');
        // sidebarList.value.push({ socketId: data.data.sender });
        // sender.value = data.data.sender;
        // const rtc = await startNewWebRtc({ receiver: data.data.sender });
        // if (rtc) {
        //   await rtc.setRemoteDescription(data.data.sdp);
        //   const sdp = await rtc.createAnswer();
        //   await rtc.setLocalDescription(sdp);
        //   instance.send({
        //     msgType: WsMsgTypeEnum.answer,
        //     data: { sdp, sender: getSocketId(), receiver: data.data.sender },
        //   });
        // }
      }
    });

    // 收到answer
    instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
      console.warn('【websocket】收到answer', data);
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
      console.warn('【websocket】收到candidate', data);
      if (isSRS) return;
      if (!instance) return;
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socketId}`);
      if (!rtc) return;
      if (data.socketId !== getSocketId()) {
        console.log('不是我发的candidate');
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
        console.log('是我发的candidate');
      }
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data: IAdminIn) => {
      console.log('【websocket】收到管理员正在直播', data);
      if (isSRS && !isFlv) {
        startNewWebRtc({});
      }
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.roomNoLive, (data: IAdminIn) => {
      console.log('【websocket】收到管理员不在直播', data);
      roomNoLive.value = true;
      closeRtc();
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      console.log('【websocket】当前所有在线用户', data);
      if (!instance) return;
      liveUserList.value = data.map((item) => ({
        avatar: 'red',
        socketId: item.id,
      }));
    });

    // 收到用户发送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data) => {
      console.log('【websocket】收到用户发送消息', data);
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
    instance.socketIo.on(WsMsgTypeEnum.joined, (data) => {
      console.log('【websocket】用户加入房间完成', data);
      roomName.value = data.data.roomName;
      track.audio = data.data.track_audio;
      track.video = data.data.track_video;
      streamurl.value = data.data.streamurl;
      flvurl.value = data.data.flvurl;
      if (isFlv) {
        useFlvPlay(flvurl.value, remoteVideoRef.value!);
      }
      instance.send({ msgType: WsMsgTypeEnum.getLiveUser });
    });

    // 其他用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
      console.log('【websocket】其他用户加入房间', data);
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.otherJoin,
        socketId: data.data.socketId,
        userInfo: data.data.userInfo,
        msg: '',
      };
      damuList.value.push(danmu);
    });

    // 用户离开房间
    instance.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      console.log('【websocket】用户离开房间', data);
      if (!instance) return;
      instance.socketIo?.emit(WsMsgTypeEnum.leave, {
        roomId: instance.roomId,
      });
    });

    // 用户离开房间完成
    instance.socketIo.on(WsMsgTypeEnum.leaved, (data) => {
      console.log('【websocket】用户离开房间完成', data);
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
    roomName,
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