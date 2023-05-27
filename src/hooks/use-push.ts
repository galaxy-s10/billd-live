import { getRandomString } from 'billd-utils';
import { Ref, nextTick, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchRtcV1Publish } from '@/api/srs';
import {
  DanmuMsgTypeEnum,
  IAdminIn,
  ICandidate,
  IDanmu,
  IJoin,
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

import { loginTip } from './use-login';

export function usePush({
  localVideoRef,
  remoteVideoRef,
  isSRS,
}: {
  localVideoRef: Ref<HTMLVideoElement | undefined>;
  remoteVideoRef: Ref<HTMLVideoElement[]>;
  isSRS?: boolean;
}) {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const heartbeatTimer = ref();
  const roomId = ref<string>(getRandomString(15));
  const danmuStr = ref('');
  const roomName = ref(getRandomString(5));
  const isDone = ref(false);
  const joined = ref(false);
  const disabled = ref(false);
  const localStream = ref();
  const offerSended = ref(new Set());
  const hooksRtcMap = ref(new Set());
  const sidebarList = ref<
    {
      socketId: string;
    }[]
  >([]);

  const track = reactive({
    audio: true,
    video: true,
  });
  const streamurl = ref(
    `webrtc://${
      process.env.NODE_ENV === 'development' ? 'localhost' : 'live.hsslive.cn'
    }/live/livestream/${roomId.value}`
  );
  const flvurl = ref(
    `${
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5001'
        : 'https://live.hsslive.cn/srsflv'
    }/live/livestream/${roomId.value}.flv`
  );

  const damuList = ref<IDanmu[]>([]);
  const liveUserList = ref<ILiveUser[]>([]);

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

  function startLive() {
    if (!loginTip()) return;
    if (!roomNameIsOk()) return;
    if (currMediaTypeList.value.length <= 0) {
      window.$message.warning('请选择一个素材！');
      return;
    }
    disabled.value = true;
    const instance = new WebSocketClass({
      roomId: roomId.value,
      url:
        process.env.NODE_ENV === 'development'
          ? 'ws://localhost:4300'
          : 'wss://live.hsslive.cn',
      isAdmin: true,
    });
    instance.update();
    initReceive();
  }

  /** 原生的webrtc时，receiver必传 */
  async function startNewWebRtc({
    receiver,
    videoEl = localVideoRef.value!,
  }: {
    receiver?: string;
    videoEl?: HTMLVideoElement;
  }) {
    if (isSRS) {
      console.warn('开始new SRSWebRTCClass');
      const rtc = new SRSWebRTCClass({
        roomId: `${roomId.value}___${getSocketId()}`,
        videoEl,
      });
      localStream.value.getTracks().forEach((track) => {
        rtc.addTransceiver({
          track,
          stream: localStream.value,
          direction: 'sendonly',
        });
      });
      try {
        const offer = await rtc.createOffer();
        if (!offer) return;
        await rtc.setLocalDescription(offer);
        const res: any = await fetchRtcV1Publish({
          api: `${
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:1985'
              : 'https://live.hsslive.cn/srs'
          }/rtc/v1/publish/`,
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

  function handleCoverImg() {
    const canvas = document.createElement('canvas');
    const { width, height } = localVideoRef.value!.getBoundingClientRect();
    const rate = width / height;
    const coverWidth = width * 0.5;
    const coverHeight = coverWidth / rate;
    canvas.width = coverWidth;
    canvas.height = coverHeight;
    canvas
      .getContext('2d')!
      .drawImage(localVideoRef.value!, 0, 0, coverWidth, coverHeight);
    // webp比png的体积小非常多！因此coverWidth就可以不用压缩太夸张
    const dataURL = canvas.toDataURL('image/webp');
    return dataURL;
  }

  function handleHeartbeat(liveId: number) {
    heartbeatTimer.value = setInterval(() => {
      const instance = networkStore.wsMap.get(roomId.value);
      if (!instance) return;
      instance.send({
        msgType: WsMsgTypeEnum.heartbeat,
        data: { liveId },
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

  function addTrack() {
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

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send({
      msgType: WsMsgTypeEnum.join,
      data: {
        roomName: roomName.value,
        coverImg: handleCoverImg(),
        srs: isSRS
          ? {
              streamurl: streamurl.value,
              flvurl: flvurl.value,
            }
          : undefined,
        track,
        userInfo: userStore.userInfo,
      },
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
      data: { sdp, sender, receiver, isAdmin: true },
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
        await addTrack();
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

  function getSocketId() {
    return networkStore.wsMap.get(roomId.value!)?.socketIo?.id || '-1';
  }

  function initReceive() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance?.socketIo) return;
    // websocket连接成功
    instance.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.connect);
      if (!instance) return;
      instance.status = WsConnectStatusEnum.connect;
      instance.update();
      sendJoin();
    });

    // websocket连接断开
    instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.disconnect, instance);
      if (!instance) return;
      instance.status = WsConnectStatusEnum.disconnect;
      instance.update();
    });

    // 收到offer
    instance.socketIo.on(WsMsgTypeEnum.offer, (data: IOffer) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.offer,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS) return;
      if (!instance) return;
      if (data.data.receiver === getSocketId()) {
        console.log('收到offer，这个offer是发给我的');
        sidebarList.value.push({ socketId: data.data.sender });
        nextTick(async () => {
          console.log(
            remoteVideoRef.value[data.data.sender],
            remoteVideoRef.value,
            22222
          );
          const rtc = await startNewWebRtc({
            receiver: data.data.sender,
            videoEl: remoteVideoRef.value[data.data.sender],
          });
          if (rtc) {
            await rtc.setRemoteDescription(data.data.sdp);
            const sdp = await rtc.createAnswer();
            await rtc.setLocalDescription(sdp);
            instance.send({
              msgType: WsMsgTypeEnum.answer,
              data: { sdp, sender: getSocketId(), receiver: data.data.sender },
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
      if (isDone.value) return;
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
      if (isDone.value) return;
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

    // 管理员正在直播
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data: IAdminIn) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomLiveing, data);
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.liveUser, data);
    });

    // 收到用户发送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.message, data);
      if (!instance) return;
      damuList.value.push({
        socketId: data.socketId,
        msgType: DanmuMsgTypeEnum.danmu,
        msg: data.data.msg,
      });
    });

    // 用户加入房间完成
    instance.socketIo.on(WsMsgTypeEnum.joined, (data: IJoin) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.joined, data);
      handleHeartbeat(data.data.liveId!);
      joined.value = true;
      liveUserList.value.push({
        socketId: `${getSocketId()}`,
      });
      if (isSRS) {
        startNewWebRtc({});
      } else {
        batchSendOffer();
      }
    });

    // 其他用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.otherJoin, data);
      liveUserList.value.push({
        socketId: data.data.socketId,
      });
      damuList.value.push({
        socketId: data.data.socketId,
        userInfo: data.data.userInfo,
        msgType: DanmuMsgTypeEnum.otherJoin,
        msg: '',
      });
      if (isSRS) return;
      if (joined.value) {
        batchSendOffer();
      }
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
      const res = liveUserList.value.filter(
        (item) => item.socketId !== data.socketId
      );
      liveUserList.value = res;
      damuList.value.push({
        socketId: data.socketId,
        msgType: DanmuMsgTypeEnum.userLeaved,
        msg: '',
      });
    });
  }

  function roomNameIsOk() {
    if (!roomName.value.length) {
      window.$message.warning('请输入房间名！');
      return false;
    }
    if (roomName.value.length < 3 || roomName.value.length > 10) {
      window.$message.warning('房间名要求3-10个字符！');
      return false;
    }
    return true;
  }

  /** 摄像头 */
  async function startGetUserMedia() {
    if (!localStream.value) {
      // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
      const event = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const audio = event.getAudioTracks();
      const video = event.getVideoTracks();
      track.audio = !!audio.length;
      track.video = !!video.length;
      console.log('getUserMedia成功', event);
      currMediaType.value = allMediaTypeList[MediaTypeEnum.camera];
      currMediaTypeList.value.push(allMediaTypeList[MediaTypeEnum.camera]);
      if (!localVideoRef.value) return;
      localVideoRef.value.srcObject = event;
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
      if (!localVideoRef.value) return;
      localVideoRef.value.srcObject = event;
      localStream.value = event;
    }
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      sendDanmu();
    }
  }

  function confirmRoomName() {
    if (!roomNameIsOk()) return;
    disabled.value = true;
  }

  function sendDanmu() {
    if (!danmuStr.value.length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) {
      window.$message.error('还没开播，不能发送弹幕');
      return;
    }
    instance.send({
      msgType: WsMsgTypeEnum.message,
      data: { msg: danmuStr.value },
    });
    damuList.value.push({
      socketId: getSocketId(),
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
    });
    danmuStr.value = '';
  }

  /** 结束直播 */
  function endLive() {
    disabled.value = false;
    closeRtc();
    currMediaTypeList.value = [];
    localStream.value = null;
    localVideoRef.value!.srcObject = null;
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send({
      msgType: WsMsgTypeEnum.roomNoLive,
      data: {},
    });
    setTimeout(() => {
      instance.close();
    }, 500);
  }
  async function getAllMediaDevices() {
    const res = await navigator.mediaDevices.enumerateDevices();
    // const audioInput = res.filter(
    //   (item) => item.kind === 'audioinput' && item.deviceId !== 'default'
    // );
    // const videoInput = res.filter(
    //   (item) => item.kind === 'videoinput' && item.deviceId !== 'default'
    // );
    return res;
  }

  async function initPush() {
    router.push({ query: { ...route.query, roomId: roomId.value } });
    const all = await getAllMediaDevices();
    allMediaTypeList[MediaTypeEnum.camera] = {
      txt: all.find((item) => item.kind === 'videoinput')?.label || '摄像头',
      type: MediaTypeEnum.camera,
    };
    console.log('initPush', localVideoRef);
    localVideoRef.value?.addEventListener('loadstart', () => {
      console.warn('视频流-loadstart');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.rtcStatus.loadstart = true;
      rtc.update();
    });

    localVideoRef.value?.addEventListener('loadedmetadata', () => {
      console.warn('视频流-loadedmetadata');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.rtcStatus.loadedmetadata = true;
      rtc.update();
      if (isSRS) return;
      if (joined.value) {
        batchSendOffer();
      }
    });
  }

  return {
    initPush,
    confirmRoomName,
    getSocketId,
    startGetDisplayMedia,
    startGetUserMedia,
    startLive,
    endLive,
    closeWs,
    closeRtc,
    sendDanmu,
    keydownDanmu,
    disabled,
    danmuStr,
    roomName,
    damuList,
    liveUserList,
    currMediaTypeList,
    hooksRtcMap,
    sidebarList,
  };
}
