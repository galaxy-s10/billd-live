import { getRandomString, judgeDevice } from 'billd-utils';
import { Ref, nextTick, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchRtcV1Play } from '@/api/srs';
import { WEBSOCKET_URL } from '@/constant';
import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import {
  DanmuMsgTypeEnum,
  IAnswer,
  ICandidate,
  IDanmu,
  IJoin,
  ILive,
  ILiveUser,
  IMessage,
  IOffer,
  IOtherJoin,
  LiveRoomTypeEnum,
  liveTypeEnum,
} from '@/interface';
import { WebRTCClass, audioElArr } from '@/network/webRTC';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  prettierReceiveWebsocket,
} from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, videoToCanvas } from '@/utils';

export function usePull({
  localVideoRef,
  canvasRef,
  isSRS,
  liveType,
}: {
  localVideoRef: Ref<HTMLVideoElement[]>;
  canvasRef: Ref<Element | undefined>;
  isSRS?: boolean;
  liveType: liveTypeEnum;
}) {
  const route = useRoute();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const videoEl = createVideo({
    muted: true,
    autoplay: true,
  });
  const remoteVideoRef = ref(videoEl);
  const heartbeatTimer = ref();
  const roomId = ref(route.params.roomId as string);
  const roomLiveType = ref<liveTypeEnum>(liveType);
  const roomName = ref('');
  const roomSocketId = ref('');
  const userName = ref('');
  const userAvatar = ref('');
  const streamurl = ref('');
  const flvurl = ref('');
  const hlsurl = ref('');
  const coverImg = ref('');
  const danmuStr = ref('');
  const balance = ref('0.00');
  const currentLiveRoom = ref<ILive>();
  const damuList = ref<IDanmu[]>([]);
  const liveUserList = ref<ILiveUser[]>([]);
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const isDone = ref(false);
  const roomNoLive = ref(false);
  const localStream = ref();
  const sidebarList = ref<
    {
      socketId: string;
    }[]
  >([]);

  const track = reactive({
    audio: 1,
    video: 1,
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

  const { flvVideoEl, startFlvPlay } = useFlvPlay();
  const { hlsVideoEl, startHlsPlay } = useHlsPlay();

  onUnmounted(() => {
    clearInterval(heartbeatTimer.value);
  });

  watch(
    () => appStore.allTrack,
    () => {
      // networkStore.rtcMap.forEach((rtc) => {
      //   if (appStore.getTrackInfo().audio > 0) {
      //     rtc!.peerConnection?.addTransceiver('audio', {
      //       direction: 'recvonly',
      //     });
      //   }
      //   if (appStore.getTrackInfo().video > 0) {
      //     rtc!.peerConnection?.addTransceiver('video', {
      //       direction: 'recvonly',
      //     });
      //   }
      // });
    },
    { deep: true }
  );

  watch(
    () => appStore.muted,
    (val) => {
      remoteVideoRef.value.muted = val;
      audioElArr.forEach((el) => {
        console.log(el, el.muted);
        el.muted = val;
      });
    }
  );

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
        // const data: IUpdateJoinInfo['data'] = {
        //   live_room_id: Number(roomId.value),
        // };
        // instance.send({
        //   msgType: WsMsgTypeEnum.updateJoinInfo,
        //   data,
        // });
      }
    }
  );

  function initPull(autolay = true) {
    autoplayVal.value = autolay;
    if (autoplayVal.value) {
      videoLoading.value = true;
    }
    console.warn('开始new WebSocketClass');
    const ws = new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: false,
    });
    ws.update();
    initWsReceive();

    remoteVideoRef.value?.addEventListener('loadstart', () => {
      console.warn('视频流-loadstart');
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
      rtc.update();
    });

    remoteVideoRef.value?.addEventListener('loadedmetadata', () => {
      console.warn('视频流-loadedmetadata');
      if (
        roomLiveType.value === liveTypeEnum.webrtcPull ||
        roomLiveType.value === liveTypeEnum.srsWebrtcPull
      ) {
        canvasRef.value?.appendChild(remoteVideoRef.value);
      }
      videoLoading.value = false;
      const rtc = networkStore.getRtcMap(roomId.value);
      if (!rtc) return;
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
    const joinData: IJoin['data'] = {
      live_room: {
        id: Number(roomId.value),
        name: roomName.value,
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
    console.log(isDone.value);
    if (isDone.value) return;
    const instance = networkStore.wsMap.get(roomId.value);
    console.log(instance, roomId.value);
    if (!instance) return;
    const rtc = networkStore.getRtcMap(`${roomId.value}___${receiver}`);
    if (!rtc) return;
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp!);
    const offerData = {
      sdp,
      sender,
      receiver,
      live_room_id: roomId.value,
    };
    instance.send({
      msgType: WsMsgTypeEnum.offer,
      data: offerData,
    });
  }

  function addVideo() {
    sidebarList.value.push({ socketId: getSocketId() });
    nextTick(() => {
      liveUserList.value.forEach(async (item) => {
        const socketId = item.id;
        console.log(item, 333);
        if (socketId === getSocketId()) {
          localVideoRef.value[getSocketId()].srcObject = localStream.value;
        }
        if (!offerSended.value.has(socketId)) {
          hooksRtcMap.value.add(
            await startNewWebRtc({
              receiver: socketId,
              videoEl: localVideoRef.value[socketId],
            })
          );
          console.log('执行sendOffer', {
            sender: getSocketId(),
            receiver: socketId,
          });
          sendOffer({ sender: getSocketId(), receiver: socketId });
          offerSended.value.add(socketId);
        }
      });
    });
  }

  /** 原生的webrtc时，receiver必传 */
  async function startNewWebRtc({
    receiver,
    videoEl = remoteVideoRef.value!,
  }: {
    receiver: string;
    videoEl?: HTMLVideoElement;
  }) {
    let rtc: WebRTCClass;
    if (isSRS) {
      if (!autoplayVal.value) return;
      console.warn('开始new SRSWebRTCClass', getSocketId());
      rtc = new WebRTCClass({
        roomId: `${roomId.value}___${getSocketId()}`,
        videoEl,
        isSRS: true,
        direction: 'recvonly',
        receiver,
      });
      rtc.update();
      try {
        const offer = await rtc.createOffer();
        if (!offer) return;
        await rtc.setLocalDescription(offer);
        const res = await fetchRtcV1Play({
          api: `/rtc/v1/play/`,
          clientip: null,
          sdp: offer.sdp!,
          streamurl: streamurl.value,
          tid: getRandomString(10),
        });
        await rtc.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: res.data.sdp })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!autoplayVal.value) return;
      console.warn('开始new WebRTCClass');
      rtc = new WebRTCClass({
        roomId: `${roomId.value}___${receiver!}`,
        videoEl,
        isSRS: false,
        direction: 'recvonly',
        receiver,
      });
    }
    return rtc;
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
      socket_id: getSocketId(),
      userInfo: userStore.userInfo,
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
    };
    const messageData: IMessage['data'] = {
      msg: danmuStr.value,
      msgType: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
    };
    instance.send({
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
    damuList.value.push(danmu);
    danmuStr.value = '';
  }

  function initWsReceive() {
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

    // 用户加入房间
    instance.socketIo.on(
      WsMsgTypeEnum.joined,
      async (data: { data: ILive }) => {
        prettierReceiveWebsocket(WsMsgTypeEnum.joined, data);
        roomSocketId.value = data.data.socket_id!;
        roomName.value = data.data.live_room?.name!;
        userName.value = data.data.user?.username!;
        userAvatar.value = data.data.user?.avatar!;
        track.audio = data.data.track_audio!;
        track.video = data.data.track_video!;
        coverImg.value = data.data.live_room?.cover_img!;
        flvurl.value = data.data.live_room?.flv_url!;
        hlsurl.value = data.data.live_room?.hls_url!;
        streamurl.value = data.data.live_room!.rtmp_url!.replace(
          'rtmp',
          'webrtc'
        );
        currentLiveRoom.value = data.data;
        if (roomLiveType.value === liveTypeEnum.srsWebrtcPull) {
          instance.send({ msgType: WsMsgTypeEnum.getLiveUser });
        } else if (roomLiveType.value === liveTypeEnum.srsFlvPull) {
          if (!autoplayVal.value) return;
          const { width, height } = await startFlvPlay({
            flvurl: flvurl.value,
          });
          videoToCanvas({
            videoEl: flvVideoEl.value!,
            targetEl: canvasRef.value!,
            width,
            height,
            // width: flvPlayer.value?.mediaInfo.width!,
            // height: flvPlayer.value?.mediaInfo.height!,
          });
          videoLoading.value = false;
        } else if (roomLiveType.value === liveTypeEnum.srsHlsPull) {
          if (!autoplayVal.value) return;
          const { width, height } = await startHlsPlay({
            hlsurl: hlsurl.value,
          });
          videoToCanvas({
            videoEl: hlsVideoEl.value!,
            targetEl: canvasRef.value!,
            width,
            height,
          });
          videoLoading.value = false;
        } else if (
          data.data.live_room?.type === LiveRoomTypeEnum.user_obs ||
          data.data.live_room?.type === LiveRoomTypeEnum.system
        ) {
          if (!autoplayVal.value) return;
          if (judgeDevice().isIphone) {
            const { width, height } = await startHlsPlay({
              hlsurl: flvurl.value,
            });
            videoToCanvas({
              videoEl: hlsVideoEl.value!,
              targetEl: canvasRef.value!,
              width,
              height,
            });
          } else {
            const { width, height } = await startFlvPlay({
              flvurl: flvurl.value,
            });
            videoToCanvas({
              videoEl: flvVideoEl.value!,
              targetEl: canvasRef.value!,
              width,
              height,
            });
          }
          videoLoading.value = false;
        }
        instance.send({
          msgType: WsMsgTypeEnum.getLiveUser,
        });
      }
    );

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
        if (!data.is_anchor) {
          sidebarList.value.push({ socketId: data.data.sender });
        }
        await nextTick(async () => {
          console.log('收到offer，这个offer是发给我的', data);
          sender.value = data.data.sender;
          let rtc = networkStore.getRtcMap(
            `${roomId.value}___${data.data.sender}`
          );
          if (!rtc) {
            rtc = await startNewWebRtc({
              receiver: data.data.sender,
              videoEl: data.is_anchor
                ? remoteVideoRef.value
                : localVideoRef.value[data.data.sender],
            });
          }
          // const rtc = await startNewWebRtc({
          //   receiver: data.data.sender,
          //   videoEl: data.is_anchor
          //     ? remoteVideoRef.value
          //     : localVideoRef.value[data.data.sender],
          // });
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
      if (!instance) return;
      const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socket_id}`);
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
    instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomLiveing, data);
      if (isSRS && roomLiveType.value !== liveTypeEnum.srsFlvPull) {
        startNewWebRtc({ receiver: getSocketId() });
      }
    });

    // 管理员不在直播
    instance.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomNoLive, data);
      roomNoLive.value = true;
      closeRtc();
    });

    // 当前所有在线用户
    instance.socketIo.on(WsMsgTypeEnum.liveUser, (data: ILiveUser[]) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.liveUser, data);
      if (!instance) return;
      liveUserList.value = data;
      // batchSendOffer();
    });

    // 收到用户发送消息
    instance.socketIo.on(WsMsgTypeEnum.message, (data: IMessage) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.message, data);
      if (!instance) return;
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.danmu,
        socket_id: data.socket_id,
        userInfo: data.user_info,
        msg: data.data.msg,
      };
      damuList.value.push(danmu);
    });

    // 其他用户加入房间
    instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data: IOtherJoin) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.otherJoin, data);
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.otherJoin,
        socket_id: data.data.join_socket_id,
        userInfo: data.data.liveRoom.user,
        msg: '',
      };
      damuList.value.push(danmu);
      liveUserList.value.push({
        id: data.data.join_socket_id,
        userInfo: data.data.liveRoom.user,
      });
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
      networkStore.removeRtc(`${roomId.value}___${data.socketId as string}`);
      if (!instance) return;
      const res = liveUserList.value.filter(
        (item) => item.id !== data.socketId
      );
      liveUserList.value = res;
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.userLeaved,
        socket_id: data.socketId,
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
    addVideo,
    autoplayVal,
    videoLoading,
    balance,
    roomLiveType,
    roomSocketId,
    roomName,
    userName,
    userAvatar,
    currentLiveRoom,
    hlsurl,
    coverImg,
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
