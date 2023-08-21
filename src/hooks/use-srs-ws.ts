import { getRandomString } from 'billd-utils';
import { computed, onUnmounted, ref, watch } from 'vue';

import { fetchRtcV1Publish } from '@/api/srs';
import { WEBSOCKET_URL } from '@/constant';
import {
  DanmuMsgTypeEnum,
  IDanmu,
  ILiveRoom,
  ILiveUser,
  IUser,
  LiveRoomTypeEnum,
} from '@/interface';
import {
  WSGetRoomAllUserType,
  WsGetLiveUserType,
  WsHeartbeatType,
  WsJoinType,
  WsLeavedType,
  WsMessageType,
  WsOtherJoinType,
  WsRoomLivingType,
  WsStartLiveType,
  WsUpdateJoinInfoType,
} from '@/interface-ws';
import { WebRTCClass } from '@/network/webRTC';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  prettierReceiveWsMsg,
} from '@/network/webSocket';
import { AppRootState, useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo } from '@/utils';

import { useRTCParams } from './use-rtc-params';

export const useSrsWs = () => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const loopHeartbeatTimer = ref();
  const liveUserList = ref<ILiveUser[]>([]);
  const roomId = ref('');
  const roomNoLive = ref(false);
  const roomLiving = ref(false);
  const liveRoomInfo = ref<ILiveRoom>();
  const anchorInfo = ref<IUser>();
  const isAnchor = ref(false);
  const localStream = ref<MediaStream>();
  const canvasVideoStream = ref<MediaStream>();
  const lastCoverImg = ref('');
  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);

  const damuList = ref<IDanmu[]>([]);

  watch(
    () => appStore.allTrack,
    (newTrack, oldTrack) => {
      console.log('appStore.allTrack变了', newTrack, oldTrack);
      const mixedStream = new MediaStream();
      newTrack.forEach((item) => {
        if (item.track) {
          mixedStream.addTrack(item.track);
        }
      });
      console.log('新的allTrack音频轨', mixedStream.getAudioTracks());
      console.log('新的allTrack视频轨', mixedStream.getVideoTracks());
      console.log('旧的allTrack音频轨', localStream.value?.getAudioTracks());
      console.log('旧的allTrack视频轨', localStream.value?.getVideoTracks());
      localStream.value = mixedStream;
    },
    { deep: true }
  );

  onUnmounted(() => {
    clearInterval(loopHeartbeatTimer.value);
  });

  watch(
    () => currentResolutionRatio.value,
    (newVal) => {
      if (canvasVideoStream.value) {
        canvasVideoStream.value.getVideoTracks().forEach((track) => {
          track.applyConstraints({
            frameRate: { max: currentMaxFramerate.value },
            height: newVal,
          });
        });
      } else {
        appStore.allTrack.forEach((info) => {
          info.track?.applyConstraints({
            frameRate: { max: currentMaxFramerate.value },
            height: newVal,
          });
        });
      }

      networkStore.rtcMap.forEach(async (rtc) => {
        const res = await rtc.setResolutionRatio(newVal);
        if (res === 1) {
          window.$message.success('切换分辨率成功！');
        } else {
          window.$message.success('切换分辨率失败！');
        }
      });
    }
  );

  watch(
    () => currentMaxFramerate.value,
    (newVal) => {
      console.log(currentMaxFramerate.value, 'currentMaxFramerate.value');
      if (canvasVideoStream.value) {
        canvasVideoStream.value.getVideoTracks().forEach((track) => {
          track.applyConstraints({
            frameRate: { max: newVal },
            height: currentResolutionRatio.value,
          });
        });
      } else {
        appStore.allTrack.forEach((info) => {
          info.track?.applyConstraints({
            frameRate: { max: newVal },
            height: currentResolutionRatio.value,
          });
        });
      }

      networkStore.rtcMap.forEach(async (rtc) => {
        const res = await rtc.setMaxFramerate(newVal);
        if (res === 1) {
          window.$message.success('切换帧率成功！');
        } else {
          window.$message.success('切换帧率失败！');
        }
      });
    }
  );

  watch(
    () => currentMaxBitrate.value,
    (newVal) => {
      networkStore.rtcMap.forEach(async (rtc) => {
        const res = await rtc.setMaxBitrate(newVal);
        if (res === 1) {
          window.$message.success('切换码率成功！');
        } else {
          window.$message.success('切换码率失败！');
        }
      });
    }
  );

  function addTrack(addTrackInfo: { track; stream }) {
    if (isAnchor.value) {
      networkStore.rtcMap.forEach((rtc) => {
        const sender = rtc.peerConnection
          ?.getSenders()
          .find((sender) => sender.track?.id === addTrackInfo.track?.id);
        if (!sender) {
          console.log('pc添加track-开播后中途添加', addTrackInfo.track?.id);
          rtc.peerConnection
            ?.getSenders()
            ?.find((sender) => sender.track?.kind === 'audio')
            ?.replaceTrack(canvasVideoStream.value!.getAudioTracks()[0]);
          const vel = createVideo({});
          vel.srcObject = canvasVideoStream.value!;
        }
      });
    }
    const mixedStream = new MediaStream();
    appStore.allTrack.forEach((item) => {
      if (item.track) {
        mixedStream.addTrack(item.track);
      }
    });
    console.log('addTrack后结果的音频轨', mixedStream.getAudioTracks());
    console.log('addTrack后结果的视频轨', mixedStream.getVideoTracks());
    localStream.value = mixedStream;
  }

  function delTrack(delTrackInfo: AppRootState['allTrack'][0]) {
    if (isAnchor.value) {
      networkStore.rtcMap.forEach((rtc) => {
        const sender = rtc.peerConnection
          ?.getSenders()
          .find((sender) => sender.track?.id === delTrackInfo.track?.id);
        if (sender) {
          console.log('删除track', delTrackInfo, sender);
          rtc.peerConnection?.removeTrack(sender);
        }
      });
    }
    const mixedStream = new MediaStream();
    appStore.allTrack.forEach((item) => {
      if (item.track) {
        mixedStream.addTrack(item.track);
      }
    });
    console.log('delTrack后结果的音频轨', mixedStream.getAudioTracks());
    console.log('delTrack后结果的视频轨', mixedStream.getVideoTracks());
    localStream.value = mixedStream;
  }

  const mySocketId = computed(() => {
    return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
  });

  function handleHeartbeat(socketId: string) {
    loopHeartbeatTimer.value = setInterval(() => {
      const ws = networkStore.wsMap.get(roomId.value);
      if (!ws) return;
      ws.send<WsHeartbeatType['data']>({
        msgType: WsMsgTypeEnum.heartbeat,
        data: {
          socket_id: socketId,
        },
      });
    }, 1000 * 5);
  }

  async function sendOffer({ receiver }: { receiver: string }) {
    console.log('开始sendOffer');
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws) return;
    const rtc = networkStore.getRtcMap(`${roomId.value}___${receiver}`);
    if (!rtc) return;
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp!);

    const myLiveRoom = userStore.userInfo!.live_rooms![0];
    const res = await fetchRtcV1Publish({
      api: `/rtc/v1/publish/`,
      clientip: null,
      sdp: sdp!.sdp!,
      streamurl: `${myLiveRoom.rtmp_url!}?token=${myLiveRoom.key!}&type=${
        LiveRoomTypeEnum.user_srs
      }`,
      tid: getRandomString(10),
    });
    networkStore.wsMap.get(roomId.value)?.send<WsUpdateJoinInfoType['data']>({
      msgType: WsMsgTypeEnum.updateJoinInfo,
      data: {
        live_room_id: Number(roomId.value),
        track: {
          audio: 1,
          video: 1,
        },
      },
    });
    if (res.data.code !== 0) {
      console.error('/rtc/v1/publish/拿不到sdp');
      window.$message.error('/rtc/v1/publish/拿不到sdp');
      return;
    }
    await rtc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: res.data.sdp })
    );
  }

  function handleStartLive({ coverImg, name }) {
    networkStore.wsMap.get(roomId.value)?.send<WsStartLiveType['data']>({
      msgType: WsMsgTypeEnum.startLive,
      data: {
        cover_img: coverImg,
        name,
        type: LiveRoomTypeEnum.user_srs,
      },
    });
    startNewSrsWebRtc({
      videoEl: document.createElement('video'),
      receiver: 'srs',
    });
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send<WsJoinType['data']>({
      msgType: WsMsgTypeEnum.join,
      data: {
        socket_id: mySocketId.value,
        live_room: {
          id: Number(roomId.value),
        },
        user_info: userStore.userInfo,
      },
    });
  }

  /** 原生的webrtc时，receiver必传 */
  function startNewSrsWebRtc({
    receiver,
    videoEl,
  }: {
    receiver: string;
    videoEl: HTMLVideoElement;
  }) {
    console.warn('SRS开始new WebRTCClass', `${roomId.value}___${receiver!}`);
    const rtc = new WebRTCClass({
      maxBitrate: currentMaxBitrate.value,
      maxFramerate: currentMaxFramerate.value,
      resolutionRatio: currentResolutionRatio.value,
      roomId: `${roomId.value}___${receiver!}`,
      videoEl,
      isSRS: true,
      receiver,
    });
    if (canvasVideoStream.value) {
      localStream.value = canvasVideoStream.value;
      rtc.localStream = canvasVideoStream.value;
      canvasVideoStream.value.getTracks().forEach((track) => {
        console.log('pc添加track-srs', track.kind, track.id);
        rtc.peerConnection?.addTrack(track, localStream.value!);
      });
    }

    sendOffer({
      receiver,
    });
  }

  function initReceive() {
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws?.socketIo) return;
    // websocket连接成功
    ws.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWsMsg(WsConnectStatusEnum.connect, ws.socketIo);
      handleHeartbeat(ws.socketIo!.id);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.connect;
      ws.update();
      sendJoin();
    });

    // websocket连接断开
    ws.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, ws);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.disconnect;
      ws.update();
    });

    // 主播正在直播
    ws.socketIo.on(WsMsgTypeEnum.roomLiving, (data: WsRoomLivingType) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.roomLiving, data);
      roomLiving.value = true;
      roomNoLive.value = false;
    });

    // 主播不在直播
    ws.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.roomNoLive, data);
      roomNoLive.value = true;
      roomLiving.value = false;
    });

    // 当前所有在线用户
    ws.socketIo.on(
      WsMsgTypeEnum.liveUser,
      (data: WSGetRoomAllUserType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.liveUser, data);
        const res = data.liveUser.map((item) => {
          return {
            id: item.id,
            // userInfo: item.id,
          };
        });
        liveUserList.value = res;
      }
    );

    // 收到用户发送消息
    ws.socketIo.on(WsMsgTypeEnum.message, (data: WsMessageType) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
      damuList.value.push({
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.danmu,
        msg: data.data.msg,
        userInfo: data.user_info,
      });
    });

    // 用户加入房间完成
    ws.socketIo.on(WsMsgTypeEnum.joined, (data: WsJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
      liveUserList.value.push({
        id: data.socket_id,
        userInfo: data.user_info,
      });
      liveRoomInfo.value = data.live_room;
      anchorInfo.value = data.anchor_info;
      ws.send<WsGetLiveUserType['data']>({
        msgType: WsMsgTypeEnum.getLiveUser,
        data: {
          live_room_id: data.live_room.id!,
        },
      });
    });

    // 其他用户加入房间
    ws.socketIo.on(WsMsgTypeEnum.otherJoin, (data: WsOtherJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
      liveUserList.value.push({
        id: data.join_socket_id,
        userInfo: data.join_user_info,
      });
      const danmu: IDanmu = {
        msgType: DanmuMsgTypeEnum.otherJoin,
        socket_id: data.join_socket_id,
        userInfo: data.join_user_info,
        msg: '',
      };
      damuList.value.push(danmu);
      ws.send<WsGetLiveUserType['data']>({
        msgType: WsMsgTypeEnum.getLiveUser,
        data: {
          live_room_id: data.live_room.id!,
        },
      });
    });

    // 用户离开房间
    ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
    });

    // 用户离开房间完成
    ws.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
      networkStore.rtcMap
        .get(`${roomId.value}___${data.socket_id as string}`)
        ?.close();
      networkStore.removeRtc(`${roomId.value}___${data.socket_id as string}`);
      const res = liveUserList.value.filter(
        (item) => item.id !== data.socket_id
      );
      liveUserList.value = res;
      damuList.value.push({
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.userLeaved,
        userInfo: data.user_info,
        msg: '',
      });
    });
  }

  function initSrsWs(data: {
    isAnchor: boolean;
    roomId: string;
    currentResolutionRatio?: number;
    currentMaxFramerate?: number;
    currentMaxBitrate?: number;
  }) {
    roomId.value = data.roomId;
    isAnchor.value = data.isAnchor;
    if (data.currentMaxBitrate) {
      currentMaxBitrate.value = data.currentMaxBitrate;
    }
    if (data.currentMaxFramerate) {
      currentMaxFramerate.value = data.currentMaxFramerate;
    }
    if (data.currentResolutionRatio) {
      currentResolutionRatio.value = data.currentResolutionRatio;
    }
    new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: data.isAnchor,
    });
    initReceive();
  }

  return {
    initSrsWs,
    addTrack,
    delTrack,
    handleStartLive,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    roomLiving,
    liveRoomInfo,
    anchorInfo,
    roomNoLive,
    localStream,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
  };
};
