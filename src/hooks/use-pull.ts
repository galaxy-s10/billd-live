import { getRandomString } from 'billd-utils';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { URL_QUERY } from '@/constant';
import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWebsocket } from '@/hooks/use-websocket';
import { useWebRtcRtmpToRtc } from '@/hooks/webrtc/rtmpToRtc';
import {
  DanmuMsgTypeEnum,
  LiveLineEnum,
  LiveRenderEnum,
  WsMessageIsFileEnum,
} from '@/interface';
import { useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import {
  WsBatchSendOffer,
  WsMsgTypeEnum,
  WsOfferType,
} from '@/types/websocket';
import {
  createVideo,
  handleUserMedia,
  videoFullBox,
  videoToCanvas,
} from '@/utils';

import { useTip } from './use-tip';
import { useWebRtcLive } from './webrtc/live';
import { useWebRtcMeetingOne } from './webrtc/meetingOne';

export function usePull() {
  const route = useRoute();
  const networkStore = useNetworkStore();
  const cacheStore = useCacheStore();
  const appStore = useAppStore();
  const danmuStr = ref('');
  const roomId = ref('');
  const msgIsFile = ref(WsMessageIsFileEnum.no);
  const danmuMsgType = ref<DanmuMsgTypeEnum>(DanmuMsgTypeEnum.danmu);
  const liveRoomInfo = ref<ILiveRoom>();
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const isPlaying = ref(false);
  const showPlayBtn = ref(false);
  const flvurl = ref('');
  const hlsurl = ref('');
  const videoWrapRef = ref<HTMLDivElement>();
  const videoResolution = ref();
  const remoteVideo = ref<Array<HTMLVideoElement | HTMLCanvasElement>>([]);
  const remoteStream = ref<MediaStream[]>([]);
  const {
    mySocketId,
    initWs,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
    sendDanmuTxt,
  } = useWebsocket();
  const { updateWebRtcRtmpToRtcConfig, webRtcRtmpToRtc } = useWebRtcRtmpToRtc();
  const { updateWebRtcLiveConfig, webRtcLive } = useWebRtcLive();
  const { updateWebRtcMeetingOneConfig, webRtcMeetingOne } =
    useWebRtcMeetingOne();
  const { flvVideoEl, flvIsPlaying, startFlvPlay, destroyFlv } = useFlvPlay();
  const { hlsVideoEl, hlsIsPlaying, startHlsPlay, destroyHls } = useHlsPlay();
  const stopDrawingArr = ref<any[]>([]);
  const rtcVideo = ref<HTMLVideoElement[]>([]);
  const userStream = ref<MediaStream>();

  let changeWrapSizeFn;

  onUnmounted(() => {
    handleStopDrawing();
    destroyFlv();
    destroyHls();
  });

  function handleStopDrawing() {
    changeWrapSizeFn = undefined;
    stopDrawingArr.value.forEach((cb) => cb());
    stopDrawingArr.value = [];
    remoteVideo.value.forEach((el) => el.remove());
    remoteVideo.value = [];
  }

  function handleVideoWrapResize() {
    nextTick(() => {
      if (videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        changeWrapSizeFn?.({ width: rect.width, height: rect.height });
      }
    });
  }

  function videoPlay(videoEl: HTMLVideoElement) {
    stopDrawingArr.value.forEach((cb) => cb());
    stopDrawingArr.value = [];
    if (appStore.videoControls.renderMode === LiveRenderEnum.canvas) {
      if (videoEl && videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        const { canvas, stopDrawing, changeWrapSize } = videoToCanvas({
          wrapSize: {
            width: rect.width,
            height: rect.height,
          },
          videoEl,
          videoResize: ({ w, h }) => {
            videoResolution.value = `${w}x${h}`;
          },
        });
        changeWrapSizeFn = changeWrapSize;
        stopDrawingArr.value.push(stopDrawing);
        remoteVideo.value.push(canvas);
        videoLoading.value = false;
      }
    } else if (appStore.videoControls.renderMode === LiveRenderEnum.video) {
      if (videoEl && videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        const { changeWrapSize } = videoFullBox({
          wrapSize: {
            width: rect.width,
            height: rect.height,
          },
          videoEl,
          videoResize: ({ w, h }) => {
            videoResolution.value = `${w}x${h}`;
          },
        });
        changeWrapSizeFn = changeWrapSize;
        remoteVideo.value.push(videoEl);
        videoLoading.value = false;
      }
    }
  }

  watch(
    () => hlsVideoEl.value,
    (newval) => {
      if (newval) {
        // @ts-ignore
        remoteStream.value.push(newval.captureStream());
      }
    }
  );

  watch(
    () => flvVideoEl.value,
    (newval) => {
      if (newval) {
        // @ts-ignore
        remoteStream.value.push(newval.captureStream());
      }
    }
  );

  watch(
    () => appStore.videoControlsValue.pageFullMode,
    () => {
      handleVideoWrapResize();
    }
  );

  watch(
    [() => appStore.videoControls.renderMode, () => remoteStream.value],
    () => {
      handleStopDrawing();
      remoteStream.value.forEach((v) => {
        const el = createVideo({});
        el.srcObject = v;
        videoPlay(el);
      });
    },
    {
      deep: true,
    }
  );

  watch(
    () => remoteVideo.value,
    (newval) => {
      newval.forEach((videoEl) => {
        videoWrapRef.value?.appendChild(videoEl);
      });
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => cacheStore.muted,
    (newVal) => {
      appStore.pageIsClick = true;
      rtcVideo.value.forEach((v) => {
        v.muted = newVal;
      });
      if (!newVal) {
        cacheStore.volume = cacheStore.volume || appStore.normalVolume;
      } else {
        cacheStore.volume = 0;
      }
    }
  );

  watch(
    () => cacheStore.volume,
    (newVal) => {
      rtcVideo.value.forEach((v) => {
        v.volume = newVal / 100;
      });
      if (!newVal) {
        cacheStore.muted = true;
      } else {
        cacheStore.muted = false;
      }
    },
    {
      immediate: true,
    }
  );

  function handleRtmpToRtcPlay() {
    console.log('handleRtmpToRtcPlay');
    handleStopDrawing();
    videoLoading.value = true;
    appStore.liveLine = LiveLineEnum['rtmp-rtc'];
    updateWebRtcRtmpToRtcConfig({
      isPk: false,
      roomId: roomId.value,
    });
    const videoEl = createVideo({
      appendChild: true,
      muted: appStore.pageIsClick ? cacheStore.muted : true,
    });
    rtcVideo.value.push(videoEl);
    webRtcRtmpToRtc.newWebRtc({
      sender: mySocketId.value,
      receiver: 'rtmpToRtc',
      videoEl,
      sucessCb: (stream) => {
        remoteStream.value.push(stream);
      },
    });
    webRtcRtmpToRtc.sendOffer({
      sender: mySocketId.value,
      receiver: 'rtmpToRtc',
    });
  }

  async function handleWebRtcLivePlay(data) {
    console.log('handleWebRtcLivePlay');
    handleStopDrawing();
    videoLoading.value = true;
    appStore.liveLine = LiveLineEnum.rtc;
    updateWebRtcLiveConfig({
      roomId: roomId.value,
      canvasVideoStream: null,
    });
    const videoEl = createVideo({
      appendChild: true,
      muted: appStore.pageIsClick ? cacheStore.muted : true,
    });
    rtcVideo.value.push(videoEl);
    webRtcLive.newWebRtc({
      sender: mySocketId.value,
      receiver: data.sender,
      videoEl,
      sucessCb: (stream) => {
        remoteStream.value.push(stream);
      },
    });

    await webRtcLive.sendAnswer({
      sender: mySocketId.value,
      // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
      receiver: data.sender,
      sdp: data.sdp,
    });
  }

  async function handleWebRtcMeetingOnePlay(data) {
    await handleMeeting();
    console.log('handleWebRtcLivePlay');
    handleStopDrawing();
    videoLoading.value = true;
    appStore.liveLine = LiveLineEnum.rtc;
    const videoEl = createVideo({
      appendChild: true,
      muted: appStore.pageIsClick ? cacheStore.muted : true,
    });
    rtcVideo.value.push(videoEl);
    webRtcMeetingOne.newWebRtc({
      // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
      // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
      sender: mySocketId.value,
      receiver: data.sender,
      videoEl,
      sucessCb: (stream) => {
        remoteStream.value.push(stream);
      },
    });
    webRtcMeetingOne.addTrack({
      stream: userStream.value,
      receiver: data.sender,
    });
    await webRtcMeetingOne.sendAnswer({
      sender: mySocketId.value,
      // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
      receiver: data.sender,
      sdp: data.sdp,
    });
  }

  async function handleMeeting() {
    await useTip({
      content: '是否加入会议？',
    });
    const stream = await handleUserMedia({
      video: true,
      audio: true,
    });
    userStream.value = stream;
    networkStore.wsMap.get(roomId.value)?.send<WsBatchSendOffer['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.batchSendOffer,
      data: {
        roomId: roomId.value,
      },
    });
  }

  function initRtcReceive() {
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws?.socketIo) return;
    // 收到nativeWebRtcOffer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcOffer,
      (data: WsOfferType['data']) => {
        console.log(
          '收2到nativeWebRtcOffer',
          data.live_room.type,
          LiveRoomTypeEnum.wertc_live,
          data
        );
        if (data.live_room.type === LiveRoomTypeEnum.wertc_live) {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer-wertc_live');
            if (networkStore.rtcMap.get(data.sender)) {
              return;
            }
            handleWebRtcLivePlay(data);
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_meeting_one) {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer-wertc_meeting_one');
            updateWebRtcMeetingOneConfig({
              roomId: roomId.value,
              anchorStream: null,
            });
            if (networkStore.rtcMap.get(data.sender)) {
              return;
            }
            handleWebRtcMeetingOnePlay(data);
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        }
      }
    );
  }

  function handleHlsPlay() {
    console.log('handleHlsPlay', hlsurl.value);
    handleStopDrawing();
    videoLoading.value = true;
    appStore.liveLine = LiveLineEnum.hls;
    startHlsPlay({
      hlsurl: hlsurl.value,
    });
  }

  function handleFlvPlay() {
    console.log('handleFlvPlay', flvurl.value);
    handleStopDrawing();
    videoLoading.value = true;
    appStore.liveLine = LiveLineEnum.flv;
    startFlvPlay({
      flvurl: flvurl.value,
    });
  }

  function handlePlay(data: ILiveRoom) {
    roomLiving.value = true;
    flvurl.value = [
      LiveRoomTypeEnum.tencent_css,
      LiveRoomTypeEnum.tencent_css_pk,
    ].includes(data.type!)
      ? data.cdn_flv_url!
      : data.flv_url!;
    hlsurl.value = [
      LiveRoomTypeEnum.tencent_css,
      LiveRoomTypeEnum.tencent_css_pk,
    ].includes(data.type!)
      ? data.cdn_hls_url!
      : data.hls_url!;
    function play() {
      if (appStore.liveLine === LiveLineEnum.flv) {
        handleFlvPlay();
      } else if (appStore.liveLine === LiveLineEnum.hls) {
        handleHlsPlay();
      }
    }
    if (LiveRoomTypeEnum.pk === data.type && !route.query[URL_QUERY.pkKey]) {
      play();
    } else if (
      [
        LiveRoomTypeEnum.system,
        LiveRoomTypeEnum.srs,
        LiveRoomTypeEnum.obs,
        LiveRoomTypeEnum.msr,
        LiveRoomTypeEnum.pk,
        LiveRoomTypeEnum.forward_bilibili,
        LiveRoomTypeEnum.forward_huya,
        LiveRoomTypeEnum.forward_all,
        LiveRoomTypeEnum.tencent_css,
        LiveRoomTypeEnum.tencent_css_pk,
      ].includes(data.type!)
    ) {
      play();
    } else if (
      [
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
      ].includes(data.type!)
    ) {
      appStore.liveLine = LiveLineEnum.rtc;
    }
  }

  watch(
    [() => roomLiving.value, () => appStore.liveRoomInfo],
    ([val, liveRoomInfo]) => {
      if (val && liveRoomInfo && liveRoomInfo.type !== undefined) {
        showPlayBtn.value = false;
        if (
          [
            LiveRoomTypeEnum.system,
            LiveRoomTypeEnum.msr,
            LiveRoomTypeEnum.srs,
            LiveRoomTypeEnum.obs,
            LiveRoomTypeEnum.tencent_css,
            LiveRoomTypeEnum.tencent_css_pk,
            LiveRoomTypeEnum.forward_bilibili,
            LiveRoomTypeEnum.forward_huya,
            LiveRoomTypeEnum.forward_all,
          ].includes(liveRoomInfo.type!)
        ) {
          handlePlay(liveRoomInfo);
        } else if (LiveRoomTypeEnum.pk === liveRoomInfo.type) {
          if (!route.query[URL_QUERY.pkKey]) {
            handlePlay(liveRoomInfo);
          }
        }
      }
      console.log('kkkkk', val, liveRoomInfo?.type);
      if (!roomLiving.value) {
        closeRtc();
        handleStopDrawing();
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => appStore.liveLine,
    (newVal) => {
      console.log('liveLine变了', newVal);
      handleStopDrawing();
      destroyFlv();
      destroyHls();
      remoteStream.value = [];
      if (!roomLiving.value) {
        return;
      }
      switch (newVal) {
        case LiveLineEnum.flv:
          handleFlvPlay();
          break;
        case LiveLineEnum.hls:
          handleHlsPlay();
          break;
        case LiveLineEnum.rtc:
          break;
        case LiveLineEnum['rtmp-rtc']:
          handleRtmpToRtcPlay();
          break;
      }
    }
  );

  watch(
    () => hlsIsPlaying.value,
    (newVal) => {
      isPlaying.value = newVal;
    }
  );

  watch(
    () => flvIsPlaying.value,
    (newVal) => {
      isPlaying.value = newVal;
    }
  );

  function initPull(data: { autolay?: boolean; roomId: string }) {
    roomId.value = data.roomId;
    if (data.autolay === undefined) {
      autoplayVal.value = true;
    } else {
      autoplayVal.value = data.autolay;
    }
    // initWs({
    //   roomId: roomId.value,
    //   isAnchor: false,
    // });
  }

  function closeWs() {
    networkStore.wsMap.forEach((ws) => {
      networkStore.removeWs(ws.roomId);
    });
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      networkStore.removeRtc(rtc.receiver);
    });
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      sendDanmuTxt(danmuStr.value);
    }
  }

  return {
    initWs,
    initRtcReceive,
    videoWrapRef,
    handlePlay,
    handleStopDrawing,
    initPull,
    closeWs,
    closeRtc,
    keydownDanmu,
    showPlayBtn,
    danmuMsgType,
    isPlaying,
    msgIsFile,
    mySocketId,
    videoResolution,
    remoteVideo,
    roomLiving,
    autoplayVal,
    videoLoading,
    damuList,
    liveUserList,
    danmuStr,
    liveRoomInfo,
    anchorInfo,
  };
}
