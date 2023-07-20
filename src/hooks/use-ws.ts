import { getRandomString } from 'billd-utils';
import { ref, watch } from 'vue';

import { fetchRtcV1Publish } from '@/api/srs';
import { WEBSOCKET_URL } from '@/constant';
import {
  DanmuMsgTypeEnum,
  IAnswer,
  ICandidate,
  IDanmu,
  IHeartbeat,
  IJoin,
  ILive,
  ILiveUser,
  IMessage,
  IOffer,
  IOtherJoin,
  IUpdateJoinInfo,
  LiveRoomTypeEnum,
} from '@/interface';
import { WebRTCClass } from '@/network/webRTC';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  prettierReceiveWebsocket,
} from '@/network/webSocket';
import { AppRootState, useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';

export const useWs = () => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const heartbeatTimer = ref();
  const liveUserList = ref<ILiveUser[]>([]);
  const roomId = ref('');
  const roomName = ref('');
  const roomNoLive = ref(false);
  const liveRoomInfo = ref<ILive>();
  const isAnchor = ref(false);
  const joined = ref(false);
  const isSRS = ref(false);
  const localVideo = ref<HTMLVideoElement>(document.createElement('video'));
  const localStream = ref<MediaStream>();
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
      label: '360P',
      value: 360,
    },
    {
      label: '720P',
      value: 720,
    },
    {
      label: '1080P',
      value: 1080,
    },
    {
      label: '1440P',
      value: 1440,
    },
  ]);
  const currentResolutionRatio = ref(resolutionRatio.value[2].value);
  const maxFramerate = ref([
    {
      label: '10帧',
      value: 10,
    },
    {
      label: '20帧',
      value: 20,
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

  const damuList = ref<IDanmu[]>([]);

  watch(
    () => appStore.muted,
    (newVal) => {
      console.log(newVal);
    }
  );

  watch(
    () => appStore.allTrack,
    (newTrack, oldTrack) => {
      console.log('appStore.allTrack变了');
      const mixedStream = new MediaStream();
      newTrack.forEach((item) => {
        mixedStream.addTrack(item.track);
      });
      // oldTrack.forEach((item) => {
      //   mixedStream.addTrack(item.track);
      // });
      console.log('新的allTrack音频轨', mixedStream.getAudioTracks());
      console.log('新的allTrack视频轨', mixedStream.getVideoTracks());
      console.log('旧的allTrack音频轨', localStream.value?.getAudioTracks());
      console.log('旧的allTrack视频轨', localStream.value?.getVideoTracks());
      localStream.value = mixedStream;
    },
    { deep: true }
  );

  watch(
    () => currentMaxFramerate.value,
    (newVal) => {
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

  watch(
    () => currentResolutionRatio.value,
    (newVal) => {
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

  function addTrack(addTrackInfo: AppRootState['allTrack'][0]) {
    if (isAnchor.value) {
      networkStore.rtcMap.forEach((rtc) => {
        const sender = rtc.peerConnection
          ?.getSenders()
          .find((sender) => sender.track === addTrackInfo.track);
        if (!sender) {
          rtc.peerConnection?.addTrack(addTrackInfo.track, addTrackInfo.stream);
        }
      });
    }
    const mixedStream = new MediaStream();
    appStore.allTrack.forEach((item) => {
      mixedStream.addTrack(item.track);
    });
    console.log('addTrack后结果的音频轨', mixedStream.getAudioTracks());
    console.log('addTrack后结果的视频轨', mixedStream.getVideoTracks());
    localStream.value = mixedStream;
    const data: IUpdateJoinInfo['data'] = {
      live_room_id: Number(roomId.value),
      track: {
        audio: appStore.getTrackInfo().audio > 0 ? 1 : 2,
        video: appStore.getTrackInfo().video > 0 ? 1 : 2,
      },
    };
    networkStore.wsMap.get(roomId.value)?.send({
      msgType: WsMsgTypeEnum.updateJoinInfo,
      data,
    });
  }
  function delTrack(delTrackInfo: AppRootState['allTrack'][0]) {
    if (isAnchor.value) {
      networkStore.rtcMap.forEach((rtc) => {
        const sender = rtc.peerConnection
          ?.getSenders()
          .find((sender) => sender.track === delTrackInfo.track);
        if (sender) {
          console.log('删除track', sender);
          rtc.peerConnection?.removeTrack(sender);
        }
      });
    }
    const mixedStream = new MediaStream();
    appStore.allTrack.forEach((item) => {
      console.log('xxxx', item.track);
      mixedStream.addTrack(item.track);
    });
    console.log('delTrack后结果的音频轨', mixedStream.getAudioTracks());
    console.log('delTrack后结果的视频轨', mixedStream.getVideoTracks());
    localStream.value = mixedStream;
    const data: IUpdateJoinInfo['data'] = {
      live_room_id: Number(roomId.value),
      track: {
        audio: appStore.getTrackInfo().audio > 0 ? 1 : 2,
        video: appStore.getTrackInfo().video > 0 ? 1 : 2,
      },
    };
    networkStore.wsMap.get(roomId.value)?.send({
      msgType: WsMsgTypeEnum.updateJoinInfo,
      data,
    });
  }

  function getSocketId() {
    return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
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
  async function sendOffer({
    sender,
    receiver,
  }: {
    sender: string;
    receiver: string;
  }) {
    console.log('开始sendOffer');
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws) return;
    const rtc = networkStore.getRtcMap(`${roomId.value}___${receiver}`);
    if (!rtc) return;
    if (!isSRS.value) {
      const sdp = await rtc.createOffer();
      await rtc.setLocalDescription(sdp!);
      ws.send({
        msgType: WsMsgTypeEnum.offer,
        data: {
          sdp,
          sender,
          receiver,
          live_room_id: roomId.value,
        },
      });
    } else {
      const sdp = await rtc.createOffer();
      await rtc.setLocalDescription(sdp!);
      const res = await fetchRtcV1Publish({
        api: `/rtc/v1/publish/`,
        clientip: null,
        sdp: sdp!.sdp!,
        streamurl: userStore.userInfo!.live_rooms![0]!.rtmp_url!.replace(
          'rtmp',
          'webrtc'
        ),
        tid: getRandomString(10),
      });
      await rtc.setRemoteDescription(
        new RTCSessionDescription({ type: 'answer', sdp: res.data.sdp })
      );
    }
  }

  function handleCoverImg() {
    const canvas = document.createElement('canvas');
    const { width, height } = localVideo.value.getBoundingClientRect();
    const rate = width / height;
    const coverWidth = width * 0.5;
    const coverHeight = coverWidth / rate;
    canvas.width = coverWidth;
    canvas.height = coverHeight;
    canvas
      .getContext('2d')!
      .drawImage(localVideo.value, 0, 0, coverWidth, coverHeight);
    // webp比png的体积小非常多！因此coverWidth就可以不用压缩太夸张
    const dataURL = canvas.toDataURL('image/webp');
    return dataURL;
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    const joinData: IJoin['data'] = {
      live_room: {
        id: Number(roomId.value),
        name: roomName.value,
        cover_img: handleCoverImg(),
        type: isSRS.value
          ? LiveRoomTypeEnum.user_srs
          : LiveRoomTypeEnum.user_wertc,
      },
      track: {
        audio: appStore.getTrackInfo().audio > 0 ? 1 : 2,
        video: appStore.getTrackInfo().video > 0 ? 1 : 2,
      },
    };
    instance.send({
      msgType: WsMsgTypeEnum.join,
      data: joinData,
    });
  }

  function handleNegotiationneeded(data: { roomId: string; isSRS: boolean }) {
    console.warn(`${data.roomId}，开始监听pc的negotiationneeded`);
    const rtc = networkStore.getRtcMap(data.roomId);
    if (!rtc) return;
    rtc.peerConnection?.addEventListener('negotiationneeded', (event) => {
      console.warn(`${data.roomId}，pc收到negotiationneeded`, event);
      sendOffer({
        sender: getSocketId(),
        receiver: rtc.receiver,
      });
    });
  }

  /** 原生的webrtc时，receiver必传 */
  function startNewWebRtc({
    receiver,
    videoEl,
  }: {
    receiver: string;
    videoEl: HTMLVideoElement;
  }) {
    let rtc: WebRTCClass;
    if (isSRS.value) {
      console.warn('SRS开始new WebRTCClass', `${roomId.value}___${receiver!}`);
      rtc = new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        roomId: `${roomId.value}___${getSocketId()}`,
        videoEl,
        isSRS: true,
        direction: 'sendonly',
        receiver,
      });
      handleNegotiationneeded({
        roomId: `${roomId.value}___${receiver}`,
        isSRS: true,
      });
      rtc.localStream = localStream.value;
      localStream.value?.getTracks().forEach((track) => {
        console.warn('srs startNewWebRtc，pc插入track');
        // rtc.peerConnection?.addTransceiver(track, {
        //   streams: [localStream.value!],
        //   direction: 'sendonly',
        // });
        rtc.peerConnection?.addTrack(track, localStream.value!);
      });
    } else {
      console.warn('开始new WebRTCClass', `${roomId.value}___${receiver!}`);
      rtc = new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        roomId: `${roomId.value}___${receiver!}`,
        videoEl,
        isSRS: false,
        direction: 'sendonly',
        receiver,
      });
      handleNegotiationneeded({
        roomId: `${roomId.value}___${receiver}`,
        isSRS: false,
      });
      rtc.localStream = localStream.value;
      localStream.value?.getTracks().forEach((track) => {
        console.warn('startNewWebRtc，pc插入track');
        // rtc.peerConnection?.addTransceiver(track, {
        //   streams: [localStream.value!],
        //   direction: 'sendonly',
        // });
        rtc.peerConnection?.addTrack(track, localStream.value!);
      });
    }
    return rtc;
  }

  function initReceive() {
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws?.socketIo) return;
    // websocket连接成功
    ws.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.connect);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.connect;
      ws.update();
      sendJoin();
    });

    // websocket连接断开
    ws.socketIo.on(WsConnectStatusEnum.disconnect, () => {
      prettierReceiveWebsocket(WsConnectStatusEnum.disconnect, ws);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.disconnect;
      ws.update();
    });

    // 收到offer
    ws.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.offer,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS.value) return;
      if (!ws) return;
      if (data.data.receiver === getSocketId()) {
        console.log('收到offer，这个offer是发给我的');
        if (!isAnchor.value) {
          // 如果是用户进来看直播
          let rtc = networkStore.getRtcMap(
            `${roomId.value}___${data.data.sender}`
          );
          if (!rtc) {
            rtc = await startNewWebRtc({
              receiver: data.data.sender,
              videoEl: localVideo.value,
            });
          }
          await rtc.setRemoteDescription(data.data.sdp);
          const sdp = await rtc.createAnswer();
          await rtc.setLocalDescription(sdp!);
          const answerData: IAnswer = {
            sdp,
            sender: getSocketId(),
            receiver: data.data.sender,
            live_room_id: data.data.live_room_id,
          };
          ws.send({
            msgType: WsMsgTypeEnum.answer,
            data: answerData,
          });
        }
      } else {
        console.log('收到offer，但是这个offer不是发给我的');
      }
    });

    // 收到answer
    ws.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.answer,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS.value) return;
      if (!ws) return;
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
    ws.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
      prettierReceiveWebsocket(
        WsMsgTypeEnum.candidate,
        `发送者：${data.data.sender}，接收者：${data.data.receiver}`,
        data
      );
      if (isSRS.value) return;
      if (!ws) return;
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
    ws.socketIo.on(WsMsgTypeEnum.roomLiveing, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomLiveing, data);
    });

    // 管理员不在直播
    ws.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.roomNoLive, data);
      roomNoLive.value = true;
    });

    // 当前所有在线用户
    ws.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.liveUser, data);
    });

    // 收到用户发送消息
    ws.socketIo.on(WsMsgTypeEnum.message, (data: IMessage) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.message, data);
      if (!ws) return;
      damuList.value.push({
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.danmu,
        msg: data.data.msg,
        userInfo: data.user_info,
      });
    });

    // 用户加入房间完成
    ws.socketIo.on(WsMsgTypeEnum.joined, (data: IJoin) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.joined, data);
      handleHeartbeat(data.data.live_id || -1);
      joined.value = true;
      liveUserList.value.push({
        id: `${getSocketId()}`,
        userInfo: data.user_info,
      });
      if (!isAnchor.value) {
        liveRoomInfo.value = data.data;
      }
    });

    // 其他用户加入房间
    ws.socketIo.on(WsMsgTypeEnum.otherJoin, (data: IOtherJoin) => {
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
      if (joined.value) {
        startNewWebRtc({
          receiver: data.data.join_socket_id,
          videoEl: localVideo.value,
        });
      }
    });

    // 用户离开房间
    ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.leave, data);
      if (!ws) return;
      ws.send({
        msgType: WsMsgTypeEnum.leave,
        data: { roomId: ws.roomId },
      });
    });

    // 用户离开房间完成
    ws.socketIo.on(WsMsgTypeEnum.leaved, (data) => {
      prettierReceiveWebsocket(WsMsgTypeEnum.leaved, data);
      networkStore.rtcMap
        .get(`${roomId.value}___${data.socketId as string}`)
        ?.close();
      networkStore.removeRtc(`${roomId.value}___${data.socketId as string}`);
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

  function initWs(data: {
    isAnchor: boolean;
    roomId: string;
    isSRS: boolean;
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
    isSRS.value = data.isSRS;
    new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: data.isAnchor,
    });
    initReceive();
  }

  return {
    getSocketId,
    initWs,
    addTrack,
    delTrack,
    liveRoomInfo,
    roomNoLive,
    heartbeatTimer,
    localStream,
    liveUserList,
    damuList,
    maxBitrate,
    maxFramerate,
    resolutionRatio,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
  };
};
