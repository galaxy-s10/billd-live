import { getRandomString } from 'billd-utils';
import { useDialog } from 'naive-ui';
import { computed, onUnmounted, ref, watch } from 'vue';

import { fetchRtcV1Publish } from '@/api/srs';
import { SRS_CB_URL_PARAMS, WEBSOCKET_URL } from '@/constant';
import {
  DanmuMsgTypeEnum,
  IDanmu,
  ILiveUser,
  IUser,
  LiveRoomTypeEnum,
} from '@/interface';
import {
  WSGetRoomAllUserType,
  WsAnswerType,
  WsCandidateType,
  WsConnectStatusEnum,
  WsDisableSpeakingType,
  WsGetLiveUserType,
  WsHeartbeatType,
  WsJoinType,
  WsLeavedType,
  WsMessageType,
  WsMsgTypeEnum,
  WsOfferType,
  WsOtherJoinType,
  WsRoomLivingType,
  WsStartLiveType,
} from '@/interface-ws';
import { WebRTCClass } from '@/network/webRTC';
import { WebSocketClass, prettierReceiveWsMsg } from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, formatDownTime } from '@/utils';

import { useRTCParams } from './use-rtcParams';

export const useWebsocket = () => {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const dialog = useDialog();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();

  const loopHeartbeatTimer = ref();
  const liveUserList = ref<ILiveUser[]>([]);
  const roomId = ref('');
  const isPull = ref(false);
  const roomLiving = ref(false);
  const isAnchor = ref(false);
  const isSRS = ref(false);
  const anchorInfo = ref<IUser>();
  const anchorSocketId = ref('');
  const canvasVideoStream = ref<MediaStream>();
  const lastCoverImg = ref('');
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const timerObj = ref({});
  const damuList = ref<IDanmu[]>([]);

  onUnmounted(() => {
    clearInterval(loopHeartbeatTimer.value);
  });

  watch(
    () => appStore.pkStream,
    (newval) => {
      console.log('转推到srs', newval);
      if (newval && isAnchor.value) {
        srsWebRtc.sendOffer({
          isPk: true,
          sender: mySocketId.value,
        });
      }
    }
  );

  const mySocketId = computed(() => {
    return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
  });

  function handleHeartbeat(socketId: string) {
    loopHeartbeatTimer.value = setInterval(() => {
      const ws = networkStore.wsMap.get(roomId.value);
      if (!ws) return;
      ws.send<WsHeartbeatType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.heartbeat,
        data: {
          socket_id: socketId,
        },
      });
    }, 1000 * 5);
  }

  function handleStartLive({
    coverImg,
    name,
    type,
    msrDelay,
    msrMaxDelay,
  }: {
    coverImg?: string;
    name?: string;
    type: LiveRoomTypeEnum;
    videoEl?: HTMLVideoElement;
    msrDelay: number;
    msrMaxDelay: number;
  }) {
    networkStore.wsMap.get(roomId.value)?.send<WsStartLiveType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.startLive,
      data: {
        cover_img: coverImg!,
        name: name!,
        type,
        msrDelay,
        msrMaxDelay,
      },
    });
    if (type === LiveRoomTypeEnum.user_msr) {
      return;
    }
    isSRS.value = true;
    if (
      ![LiveRoomTypeEnum.user_wertc, LiveRoomTypeEnum.user_pk].includes(type)
    ) {
      srsWebRtc.sendOffer({
        isPk: false,
        sender: mySocketId.value,
      });
    }
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send<WsJoinType['data']>({
      requestId: getRandomString(8),
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

  async function handleUserMedia({ video, audio }) {
    try {
      const event = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      });
      return event;
    } catch (error) {
      console.log(error);
    }
  }

  const nativeWebRtc = {
    newWebrtc: ({
      isAnchor,
      sender,
      receiver,
      videoEl,
    }: {
      isAnchor: boolean;
      sender: string;
      receiver: string;
      videoEl: HTMLVideoElement;
    }) => {
      return new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        isSRS: false,
        roomId: `${mySocketId.value}___${roomId.value}`,
        isAnchor,
        videoEl,
        sender,
        receiver,
        localStream: canvasVideoStream.value,
      });
    },
    /**
     * 原生webrtc视频通话
     * 视频发起方是房主，房主发offer给用户
     */
    sendOffer: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string;
    }) => {
      console.log('开始nativeWebRtc的sendOffer', { sender, receiver });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = nativeWebRtc.newWebrtc({
          isAnchor: true,
          sender,
          receiver,
          videoEl: createVideo({
            appendChild: true,
          }),
        });
        canvasVideoStream.value?.getTracks().forEach((track) => {
          if (rtc && canvasVideoStream.value) {
            console.log(
              'nativeWebRtc的canvasVideoStream插入track',
              track.kind,
              track
            );
            rtc.peerConnection?.addTrack(track, canvasVideoStream.value);
          }
        });
        const offerSdp = await rtc.createOffer();
        if (!offerSdp) {
          console.error('nativeWebRtc的offerSdp为空');
          return;
        }
        await rtc.setLocalDescription(offerSdp!);
        networkStore.wsMap.get(roomId.value)?.send<WsOfferType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.nativeWebRtcOffer,
          data: {
            live_room: appStore.liveRoomInfo!,
            live_room_id: Number(roomId.value),
            sender,
            receiver,
            sdp: offerSdp,
          },
        });
      } catch (error) {
        console.error('nativeWebRtc的sendOffer错误');
      }
    },
    /**
     * 原生webrtc视频通话
     * 用户收到房主的offer，用户回复房主answer
     */
    sendAnswer: async ({
      isPk,
      sdp,
      sender,
      receiver,
    }: {
      isPk: boolean;
      sdp: RTCSessionDescriptionInit;
      sender: string;
      receiver: string;
    }) => {
      console.log('开始nativeWebRtc的sendAnswer', { sender, receiver, sdp });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = nativeWebRtc.newWebrtc({
          isAnchor: false,
          sender,
          receiver,
          videoEl: createVideo({ appendChild: true }),
        });
        await rtc.setRemoteDescription(sdp);
        if (isPk) {
          if (!isAnchor.value) {
            const stream = await handleUserMedia({ video: true, audio: true });
            if (rtc?.peerConnection) {
              rtc.peerConnection.onnegotiationneeded = (event) => {
                console.log('onnegotiationneeded', event);
              };
              stream?.getTracks().forEach((track) => {
                console.log(rtc, stream, track);
                rtc.peerConnection?.addTrack(track, stream);
              });
            }
          }
        }
        const answerSdp = await rtc.createAnswer();
        if (!answerSdp) {
          console.error('nativeWebRtc的answerSdp为空');
          return;
        }
        await rtc.setLocalDescription(answerSdp);
        networkStore.wsMap.get(roomId.value)?.send<WsAnswerType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.nativeWebRtcAnswer,
          data: {
            live_room_id: Number(roomId.value),
            sender: receiver,
            receiver: sender,
            sdp: answerSdp,
          },
        });
      } catch (error) {
        console.error('nativeWebRtc的sendAnswer错误');
      }
    },
  };

  const srsWebRtc = {
    newWebrtc: ({
      roomId,
      sender,
      videoEl,
    }: {
      roomId: string;
      sender: string;
      videoEl: HTMLVideoElement;
    }) => {
      return new WebRTCClass({
        isAnchor: true,
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        roomId,
        videoEl,
        isSRS: true,
        sender,
        receiver: 'srs',
        localStream: canvasVideoStream.value,
      });
    },
    /**
     * srs的webrtc推流视频通话
     * 视频发起方是房主，房主发offer给srs
     */
    sendOffer: async ({ isPk, sender }: { isPk: boolean; sender: string }) => {
      console.log('开始srsWebRtc的sendOffer', { sender });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = srsWebRtc.newWebrtc({
          roomId: `${
            isPk
              ? `${mySocketId.value}___${roomId.value}___pk`
              : `${mySocketId.value}___${roomId.value}`
          }`,
          sender,
          videoEl: createVideo({ appendChild: true }),
        });
        canvasVideoStream.value?.getTracks().forEach((track) => {
          if (rtc && canvasVideoStream.value) {
            console.log(
              'srsWebRtc的canvasVideoStream插入track',
              track.kind,
              track
            );
            rtc.peerConnection?.addTrack(track, canvasVideoStream.value);
          }
        });
        const offerSdp = await rtc.createOffer();
        if (!offerSdp) {
          console.error('srsWebRtc的offerSdp为空');
          return;
        }
        await rtc.setLocalDescription(offerSdp!);
        const myLiveRoom = userStore.userInfo!.live_rooms![0];
        const answerRes = await fetchRtcV1Publish({
          api: `/rtc/v1/publish/`,
          clientip: null,
          sdp: offerSdp!.sdp!,
          streamurl: `${myLiveRoom.rtmp_url!}?${
            SRS_CB_URL_PARAMS.publishKey
          }=${myLiveRoom.key!}&${SRS_CB_URL_PARAMS.publishType}=${
            LiveRoomTypeEnum.user_srs
          }`,
          tid: getRandomString(10),
        });
        if (answerRes.data.code !== 0) {
          console.error('/rtc/v1/publish/拿不到sdp');
          window.$message.error('/rtc/v1/publish/拿不到sdp');
          return;
        }
        await rtc.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: answerRes.data.sdp })
        );
      } catch (error) {
        console.error('srsWebRtc的sendOffer错误');
      }
    },
  };

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
    ws.socketIo.on(WsConnectStatusEnum.disconnect, (err) => {
      prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, ws);
      console.log('websocket连接断开', err);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.disconnect;
      ws.update();
    });

    // 收到srsOffer
    ws.socketIo.on(
      WsMsgTypeEnum.srsOffer,
      async (data: WsOfferType['data']) => {
        console.log('收到srsOffer', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的srsOffer');
          const videoEl = createVideo({ appendChild: true });
          const rtc = new WebRTCClass({
            isAnchor: true,
            maxBitrate: currentMaxBitrate.value,
            maxFramerate: currentMaxFramerate.value,
            resolutionRatio: currentResolutionRatio.value,
            roomId: `${mySocketId.value}___${roomId.value}`,
            videoEl,
            isSRS: true,
            sender: data.sender,
            receiver: data.receiver,
          });
          isSRS.value = true;
          await rtc.setRemoteDescription(data.sdp);
          const answerSdp = await rtc.createAnswer();
          if (answerSdp) {
            await rtc.setLocalDescription(answerSdp);
            ws.send<WsAnswerType['data']>({
              requestId: getRandomString(8),
              msgType: WsMsgTypeEnum.srsAnswer,
              data: {
                live_room_id: Number(roomId.value),
                sdp: answerSdp,
                receiver: data.sender,
                sender: mySocketId.value,
              },
            });
          } else {
            console.error('srsOffer的answerSdp为空');
          }
        } else {
          console.error('不是发给我的srsOffer');
        }
      }
    );

    // 收到srsAnswer
    ws.socketIo.on(WsMsgTypeEnum.srsAnswer, (data: WsAnswerType['data']) => {
      console.log('收到srsAnswer', data);
      if (data.receiver === mySocketId.value) {
        console.warn('是发给我的srsAnswer');
        const rtc = networkStore.getRtcMap(
          `${mySocketId.value}___${roomId.value}`
        )!;
        rtc.setRemoteDescription(data.sdp);
      } else {
        console.error('不是发给我的srsAnswer');
      }
    });

    // 收到srsCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.srsCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到srsCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的srsCandidate');
          const rtc = networkStore.getRtcMap(
            `${mySocketId.value}___${roomId.value}`
          )!;
          rtc.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的srsCandidate');
        }
      }
    );

    // 收到nativeWebRtcOffer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcOffer,
      async (data: WsOfferType['data']) => {
        console.log('收到nativeWebRtcOffer', data);
        console.log(data.live_room.type, LiveRoomTypeEnum.user_pk);
        if (data.live_room.type === LiveRoomTypeEnum.user_pk) {
          if (!isAnchor.value) {
            dialog.warning({
              title: '提示',
              content: '是否加入PK',
              positiveText: '确认',
              onPositiveClick() {
                return new Promise((resolve) => {
                  resolve(1);
                  if (data.receiver === mySocketId.value) {
                    console.warn('是发给我的nativeWebRtcOffer');
                    nativeWebRtc.sendAnswer({
                      isPk: data.live_room.type === LiveRoomTypeEnum.user_pk,
                      sender: data.sender,
                      receiver: data.receiver,
                      sdp: data.sdp,
                    });
                  } else {
                    console.error('不是发给我的nativeWebRtcOffer');
                  }
                });
              },
            });
          } else {
            if (data.receiver === mySocketId.value) {
              console.warn('是发给我的nativeWebRtcOffer');
              nativeWebRtc.sendAnswer({
                isPk: data.live_room.type === LiveRoomTypeEnum.user_pk,
                sender: data.sender,
                receiver: data.receiver,
                sdp: data.sdp,
              });
            } else {
              console.error('不是发给我的nativeWebRtcOffer');
            }
          }
        } else {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer');
            await nativeWebRtc.sendAnswer({
              isPk: false,
              sender: data.sender,
              receiver: data.receiver,
              sdp: data.sdp,
            });
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        }
      }
    );

    // 收到nativeWebRtcAnswer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcAnswer,
      async (data: WsAnswerType['data']) => {
        console.log('收到nativeWebRtcAnswer', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcAnswer');
          const rtc = networkStore.getRtcMap(
            `${mySocketId.value}___${roomId.value}`
          )!;
          await rtc.setRemoteDescription(data.sdp);
        } else {
          console.error('不是发给我的nativeWebRtcAnswer');
        }
      }
    );

    // 收到nativeWebRtcCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到nativeWebRtcCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcCandidate');
          const rtc = networkStore.getRtcMap(
            `${mySocketId.value}___${roomId.value}`
          )!;
          rtc?.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的nativeWebRtcCandidate');
        }
      }
    );

    // 主播正在直播
    ws.socketIo.on(
      WsMsgTypeEnum.roomLiving,
      (data: WsRoomLivingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.roomLiving, data);
        roomLiving.value = true;
        if (data.anchor_socket_id) {
          anchorSocketId.value = data.anchor_socket_id;
        }
        isSRS.value = true;
        if (
          data.live_room.type &&
          [LiveRoomTypeEnum.user_wertc, LiveRoomTypeEnum.user_pk].includes(
            data.live_room.type
          )
        ) {
          isSRS.value = false;
        }
      }
    );

    // 主播不在直播
    ws.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.roomNoLive, data);
      roomLiving.value = false;
    });

    // 当前所有在线用户
    ws.socketIo.on(
      WsMsgTypeEnum.liveUser,
      (data: WSGetRoomAllUserType['data']) => {
        console.log('当前所有在线用户', data.liveUser);
        prettierReceiveWsMsg(WsMsgTypeEnum.liveUser, data);
        liveUserList.value = data.liveUser;
      }
    );

    // 收到用户发送消息
    ws.socketIo.on(WsMsgTypeEnum.message, (data: WsMessageType) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
      damuList.value.push({
        request_id: data.request_id,
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.danmu,
        msg: data.data.msg,
        userInfo: data.user_info,
        msgIsFile: data.data.msgIsFile,
        sendMsgTime: data.data.sendMsgTime,
      });
    });

    // 收到disableSpeaking
    ws.socketIo.on(
      WsMsgTypeEnum.disableSpeaking,
      (data: WsDisableSpeakingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.disableSpeaking, data);
        if (data.is_disable_speaking) {
          window.$message.error('你已被禁言！');
          appStore.disableSpeaking.set(data.live_room_id, {
            exp: data.disable_expired_at,
            label: formatDownTime({
              startTime: +new Date(),
              endTime: data.disable_expired_at,
            }),
          });
          clearTimeout(timerObj.value[data.live_room_id]);
          timerObj.value[data.live_room_id] = setInterval(() => {
            if (
              data.disable_expired_at &&
              +new Date() > data.disable_expired_at
            ) {
              clearTimeout(timerObj.value[data.live_room_id]);
            }
            appStore.disableSpeaking.set(data.live_room_id, {
              exp: data.disable_expired_at!,
              label: formatDownTime({
                startTime: +new Date(),
                endTime: data.disable_expired_at!,
              }),
            });
          }, 1000);
          damuList.value = damuList.value.filter(
            (v) => v.request_id !== data.request_id
          );
        }
        if (data.user_id !== userStore.userInfo?.id && data.disable_ok) {
          window.$message.success('禁言成功！');
        }
        if (
          data.user_id !== userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('解除禁言成功！');
        }
        if (
          data.user_id === userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('禁言接触了！');
          clearTimeout(timerObj.value[data.live_room_id]);
          appStore.disableSpeaking.delete(data.live_room_id);
        }
      }
    );

    // 用户加入房间完成
    ws.socketIo.on(WsMsgTypeEnum.joined, (data: WsJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
      // liveUserList.value.push({
      //   id: data.socket_id,
      //   userInfo: data.user_info,
      // });
      appStore.setLiveRoomInfo(data.live_room);
      anchorInfo.value = data.anchor_info;
      ws.send<WsGetLiveUserType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.getLiveUser,
        data: {
          live_room_id: data.live_room.id!,
        },
      });
    });

    // 其他用户加入房间
    ws.socketIo.on(WsMsgTypeEnum.otherJoin, (data: WsOtherJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
      // liveUserList.value.push({
      //   id: data.join_socket_id,
      //   userInfo: data.join_user_info,
      // });
      const requestId = getRandomString(8);
      const danmu: IDanmu = {
        request_id: requestId,
        msgType: DanmuMsgTypeEnum.otherJoin,
        socket_id: data.join_socket_id,
        userInfo: data.join_user_info,
        msgIsFile: false,
        msg: '',
        sendMsgTime: +new Date(),
      };
      damuList.value.push(danmu);
      ws.send<WsGetLiveUserType['data']>({
        requestId,
        msgType: WsMsgTypeEnum.getLiveUser,
        data: {
          live_room_id: data.live_room.id!,
        },
      });
      if (!isPull.value && !isSRS.value) {
        if (!roomLiving.value) return;
      }
      if (
        [LiveRoomTypeEnum.user_wertc, LiveRoomTypeEnum.user_pk].includes(
          data.live_room.type!
        )
      ) {
        isSRS.value = false;
        nativeWebRtc.sendOffer({
          sender: mySocketId.value,
          receiver: data.join_socket_id,
        });
      }
    });

    // 用户离开房间
    ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
    });

    // 用户离开房间完成
    ws.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
      if (anchorSocketId.value === data.socket_id) {
        roomLiving.value = false;
      }
      networkStore.rtcMap.get(`${roomId.value}`)?.close();
      networkStore.removeRtc(`${roomId.value}`);
      // const res = liveUserList.value.filter(
      //   (item) => item.id !== data.socket_id
      // );
      // liveUserList.value = res;
      damuList.value.push({
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.userLeaved,
        msgIsFile: false,
        userInfo: data.user_info,
        msg: '',
        sendMsgTime: +new Date(),
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
    isPull,
    initSrsWs,
    handleStartLive,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
  };
};
