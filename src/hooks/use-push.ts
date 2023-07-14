import { getRandomString, windowReload } from 'billd-utils';
import {
  Ref,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchRtcV1Publish } from '@/api/srs';
import {
  fetchCreateUserLiveRoom,
  fetchUserHasLiveRoom,
} from '@/api/userLiveRoom';
import { WEBSOCKET_URL } from '@/constant';
import {
  DanmuMsgTypeEnum,
  IAnswer,
  ICandidate,
  IDanmu,
  IHeartbeat,
  IJoin,
  ILiveUser,
  IMessage,
  IOffer,
  IOtherJoin,
  LiveRoomTypeEnum,
  MediaTypeEnum,
} from '@/interface';
import { WebRTCClass } from '@/network/webRTC';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  prettierReceiveWebsocket,
} from '@/network/webSocket';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';

import { loginTip } from './use-login';
import { useTip } from './use-tip';

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
  const roomId = ref('-1');
  const roomName = ref('');
  const danmuStr = ref('');
  const isLiving = ref(false);
  const isDone = ref(false);
  const joined = ref(false);
  const localStream = ref<MediaStream>();
  const offerSended = ref(new Set());
  const webRTC = ref<WebRTCClass>();
  const maxBitrate = ref([
    {
      label: '1000',
      value: 1000,
    },
    {
      label: '2000',
      value: 2000,
    },
    {
      label: '3000',
      value: 3000,
    },
    {
      label: '4000',
      value: 4000,
    },
    {
      label: '5000',
      value: 5000,
    },
    {
      label: '6000',
      value: 6000,
    },
    {
      label: '7000',
      value: 7000,
    },
    {
      label: '8000',
      value: 8000,
    },
    {
      label: '9000',
      value: 9000,
    },
    {
      label: '10000',
      value: 10000,
    },
  ]);
  const currentMaxBitrate = ref(maxBitrate.value[0].value);

  const resolutionRatio = ref([
    {
      label: '1440P',
      value: 1440,
    },
    {
      label: '1080P',
      value: 1080,
    },
    {
      label: '720P',
      value: 720,
    },
    {
      label: '360P',
      value: 360,
    },
  ]);
  const currentResolutionRatio = ref(resolutionRatio.value[1].value);

  const maxFramerate = ref([
    {
      label: '10帧',
      value: 10,
    },
    {
      label: '24帧',
      value: 24,
    },
    {
      label: '30帧',
      value: 30,
    },
    {
      label: '60帧',
      value: 60,
    },
  ]);
  const currentMaxFramerate = ref(maxFramerate.value[1].value);

  const track = reactive({
    audio: 1,
    video: 1,
  });
  const streamurl = ref('');

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

  watch(
    () => currentMaxFramerate.value,
    async (newVal) => {
      if (!webRTC.value) {
        return;
      }
      const res = await webRTC.value.setMaxFramerate(newVal);
      if (res === 1) {
        window.$message.success('切换帧率成功！');
      } else {
        window.$message.success('切换帧率失败！');
      }
    }
  );
  watch(
    () => currentMaxBitrate.value,
    async (newVal) => {
      if (!webRTC.value) {
        return;
      }
      const res = await webRTC.value.setMaxBitrate(newVal);
      if (res === 1) {
        window.$message.success('切换码率成功！');
      } else {
        window.$message.success('切换码率失败！');
      }
    }
  );

  watch(
    () => currentResolutionRatio.value,
    async (newVal) => {
      if (!webRTC.value) {
        return;
      }
      const res = await webRTC.value.setResolutionRatio(newVal);
      if (res === 1) {
        window.$message.success('切换分辨率成功！');
      } else {
        window.$message.success('切换分辨率失败！');
      }
    }
  );

  watch(
    () => userStore.userInfo,
    async (newVal) => {
      if (newVal) {
        const res = await userHasLiveRoom();
        if (!res) {
          await useTip('你还没有直播间，是否立即开通？');
          await handleCreateUserLiveRoom();
        } else {
          const rtmpUrl = newVal.live_rooms![0]!.rtmp_url!.replace(
            'rtmp',
            'webrtc'
          );
          streamurl.value = rtmpUrl;
        }
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    roomId.value = route.query.roomId as string;
    if (!loginTip()) return;
  });

  onUnmounted(() => {
    clearInterval(heartbeatTimer.value);
    closeWs();
    closeRtc();
  });

  function closeWs() {
    const instance = networkStore.wsMap.get(roomId.value);
    instance?.close();
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      rtc.close();
    });
  }

  async function userHasLiveRoom() {
    const res = await fetchUserHasLiveRoom(userStore.userInfo?.id!);
    if (res.code === 200 && res.data) {
      roomName.value = res.data.live_room?.name || '';
      roomId.value = `${res.data.live_room?.id || -1}`;
      router.push({ query: { ...route.query, roomId: roomId.value } });
      return true;
    }
    return false;
  }

  async function handleCreateUserLiveRoom() {
    try {
      const res = await fetchCreateUserLiveRoom();
      if (res.code === 200) {
        window.$message.success('开通直播间成功！');
        setTimeout(() => {
          windowReload();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function startLive() {
    if (!loginTip()) return;
    const flag = await userHasLiveRoom();
    if (!flag) {
      await useTip('你还没有直播间，是否立即开通？');
      await handleCreateUserLiveRoom();
      return;
    }
    if (!roomNameIsOk()) return;
    if (currMediaTypeList.value.length <= 0) {
      window.$message.warning('请选择一个素材！');
      return;
    }
    const instance = new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: true,
    });
    isLiving.value = true;
    instance.update();
    initReceive();
  }

  /** 结束直播 */
  function endLive() {
    isLiving.value = false;
    currMediaTypeList.value = [];
    localStream.value = undefined;
    localVideoRef.value!.srcObject = null;
    clearInterval(heartbeatTimer.value);
    const instance = networkStore.wsMap.get(roomId.value);
    if (instance) {
      instance.send({
        msgType: WsMsgTypeEnum.roomNoLive,
        data: {},
      });
    }
    setTimeout(() => {
      closeWs();
      closeRtc();
    }, 500);
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
      console.warn('开始new SRSWebRTCClass', `${roomId.value}___${receiver!}`);
      const rtc = new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        roomId: `${roomId.value}___${getSocketId()}`,
        videoEl,
        isSRS: true,
      });
      webRTC.value = rtc;
      localStream.value?.getTracks().forEach((track) => {
        rtc.addTrack(track, localStream.value);
      });
      try {
        const offer = await rtc.createOffer();
        if (!offer) return;
        await rtc.setLocalDescription(offer);
        const res = await fetchRtcV1Publish({
          api: `/rtc/v1/publish/`,
          clientip: null,
          sdp: offer.sdp!,
          streamurl: userStore.userInfo!.live_rooms![0]!.rtmp_url!.replace(
            'rtmp',
            'webrtc'
          ),
          tid: getRandomString(10),
        });
        await rtc.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: res.data.sdp })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.warn('开始new WebRTCClass', `${roomId.value}___${receiver!}`);
      const rtc = new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        roomId: `${roomId.value}___${receiver!}`,
        videoEl,
        isSRS: false,
      });
      webRTC.value = rtc;
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
      const heartbeatData: IHeartbeat['data'] = {
        live_id: liveId,
        live_room_id: Number(roomId.value),
      };
      instance.send({
        msgType: WsMsgTypeEnum.heartbeat,
        data: heartbeatData,
      });
    }, 1000 * 5);
  }

  function addTrack() {
    if (!localStream.value) return;
    liveUserList.value.forEach((item) => {
      if (item.id !== getSocketId()) {
        localStream.value?.getTracks().forEach((track) => {
          const rtc = networkStore.getRtcMap(`${roomId.value}___${item.id}`);
          rtc?.addTrack(track, localStream.value);
        });
      }
    });
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const joinData: IJoin['data'] = {
      live_room: {
        id: Number(roomId.value),
        name: roomName.value,
        cover_img: handleCoverImg(),
        type: isSRS ? LiveRoomTypeEnum.user_srs : LiveRoomTypeEnum.user_wertc,
      },
      track,
    };
    instance.send({
      msgType: WsMsgTypeEnum.join,
      data: joinData,
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
    await rtc.setLocalDescription(sdp!);
    instance.send({
      msgType: WsMsgTypeEnum.offer,
      data: {
        sdp,
        sender,
        receiver,
        live_room_id: roomId.value,
      },
    });
  }

  function batchSendOffer() {
    console.log('batchSendOffer');
    liveUserList.value.forEach(async (item) => {
      const socketId = item.id;
      if (!offerSended.value.has(socketId) && socketId !== getSocketId()) {
        const rtc = networkStore.getRtcMap(`${roomId.value}___${socketId}`);
        if (!rtc) {
          await startNewWebRtc({
            receiver: socketId,
            videoEl: localVideoRef.value,
          });
        }
        await addTrack();
        console.log('执行sendOffer', {
          sender: getSocketId(),
          receiver: socketId,
        });
        sendOffer({ sender: getSocketId(), receiver: socketId });
        offerSended.value.add(socketId);
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
        nextTick(async () => {
          const rtc = await startNewWebRtc({
            receiver: data.data.sender,
            videoEl: remoteVideoRef.value[data.data.sender],
          });
          if (rtc) {
            await rtc.setRemoteDescription(data.data.sdp);
            const sdp = await rtc.createAnswer();
            await rtc.setLocalDescription(sdp!);
            const answerData: IAnswer = {
              sdp,
              sender: getSocketId(),
              receiver: data.data.sender,
              live_room_id: data.data.live_room_id,
            };
            instance.send({
              msgType: WsMsgTypeEnum.answer,
              data: answerData,
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
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socket_id}`);
      if (!rtc) return;
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
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socket_id}`);
      if (!rtc) return;
      if (data.socket_id !== getSocketId()) {
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
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomLiveing, data);
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.liveUser, data);
    });

    // 收到用户发送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data: IMessage) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.message, data);
      if (!instance) return;
      damuList.value.push({
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.danmu,
        msg: data.data.msg,
        userInfo: data.user_info,
      });
    });

    // 用户加入房间完成
    instance.socketIo.on(WsMsgTypeEnum.joined, (data: IJoin) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.joined, data);
      handleHeartbeat(data.data.live_id || -1);
      joined.value = true;
      liveUserList.value.push({
        id: `${getSocketId()}`,
        userInfo: data.user_info,
      });
      if (isSRS) {
        startNewWebRtc({});
      } else {
        batchSendOffer();
      }
    });

    // 其他用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data: IOtherJoin) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.otherJoin, data);
      liveUserList.value.push({
        id: data.data.join_socket_id,
        userInfo: data.data.liveRoom.user,
      });
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.otherJoin,
        socket_id: data.data.join_socket_id,
        userInfo: data.data.liveRoom.user,
        msg: '',
      };
      damuList.value.push(danmu);
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
      networkStore.rtcMap
        .get(`${roomId.value}___${data.socketId as string}`)
        ?.close();
      const res = liveUserList.value.filter(
        (item) => item.id !== data.socketId
      );
      liveUserList.value = res;
      damuList.value.push({
        socket_id: data.socketId,
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
    if (roomName.value.length < 3 || roomName.value.length > 30) {
      window.$message.warning('房间名要求3-30个字符！');
      return false;
    }
    return true;
  }

  /** 摄像头 */
  async function startGetUserMedia() {
    if (!localStream.value) {
      // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
      const event = await navigator.mediaDevices.getUserMedia({
        video: {
          height: currentResolutionRatio.value,
          frameRate: { ideal: currentMaxFramerate.value, max: 90 },
        },
        audio: true,
      });
      const audio = event.getAudioTracks();
      const video = event.getVideoTracks();
      track.audio = audio.length ? 1 : 2;
      track.video = video.length ? 1 : 2;
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
        video: {
          height: currentResolutionRatio.value,
          frameRate: { ideal: currentMaxFramerate.value, max: 90 },
        },
        audio: true,
      });
      const audio = event.getAudioTracks();
      const video = event.getVideoTracks();
      track.audio = audio.length ? 1 : 2;
      track.video = video.length ? 1 : 2;
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
  }

  function sendDanmu() {
    if (!danmuStr.value.length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) {
      window.$message.error('还没开播，不能发送弹幕！');
      return;
    }
    const messageData: IMessage['data'] = {
      msg: danmuStr.value,
      msgType: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
    };
    instance.send({
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
    damuList.value.push({
      socket_id: getSocketId(),
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
      userInfo: userStore.userInfo,
    });
    danmuStr.value = '';
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
    const all = await getAllMediaDevices();
    allMediaTypeList[MediaTypeEnum.camera] = {
      txt: all.find((item) => item.kind === 'videoinput')?.label || '摄像头',
      type: MediaTypeEnum.camera,
    };
    localVideoRef.value?.addEventListener('loadstart', () => {
      console.warn('视频流-loadstart');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.update();
    });

    localVideoRef.value?.addEventListener('loadedmetadata', () => {
      console.warn('视频流-loadedmetadata');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.update();
      if (isSRS) return;
      if (joined.value) {
        batchSendOffer();
      }
    });
  }

  return {
    initPush,
    isLiving,
    confirmRoomName,
    getSocketId,
    startGetDisplayMedia,
    startGetUserMedia,
    startLive,
    endLive,
    sendDanmu,
    keydownDanmu,
    currentResolutionRatio,
    currentMaxBitrate,
    currentMaxFramerate,
    resolutionRatio,
    maxBitrate,
    maxFramerate,
    danmuStr,
    roomName,
    damuList,
    liveUserList,
    currMediaTypeList,
  };
}
