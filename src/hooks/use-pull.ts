import { getRandomString } from 'billd-utils';
import { onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  DanmuMsgTypeEnum,
  LiveLineEnum,
  WsMessageMsgIsFileEnum,
} from '@/interface';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { WsMessageType, WsMsgTypeEnum } from '@/types/websocket';
import { videoFullBox, videoToCanvas } from '@/utils';

export function usePull(roomId: string) {
  const route = useRoute();
  const networkStore = useNetworkStore();
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const danmuStr = ref('');
  const msgIsFile = ref(WsMessageMsgIsFileEnum.no);
  const danmuMsgType = ref<DanmuMsgTypeEnum>(DanmuMsgTypeEnum.danmu);
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const isPlaying = ref(false);
  const flvurl = ref('');
  const hlsurl = ref('');
  const videoWrapRef = ref<HTMLDivElement>();
  const videoHeight = ref();
  const videoElArr = ref<HTMLVideoElement[]>([]);
  const remoteVideo = ref<HTMLElement[]>([]);
  const {
    mySocketId,
    initWs,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
    handleSendGetLiveUser,
  } = useWebsocket();
  const { flvVideoEl, flvIsPlaying, startFlvPlay, destroyFlv } = useFlvPlay();
  const { hlsVideoEl, hlsIsPlaying, startHlsPlay, destroyHls } = useHlsPlay();
  const stopDrawingArr = ref<any[]>([]);

  onUnmounted(() => {
    handleStopDrawing();
  });

  function handleStopDrawing() {
    destroyFlv();
    destroyHls();
    stopDrawingArr.value.forEach((cb) => cb());
    stopDrawingArr.value = [];
    remoteVideo.value.forEach((el) => el.remove());
    remoteVideo.value = [];
  }

  watch(hlsVideoEl, (newval) => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    if (newval && videoWrapRef.value) {
      const rect = videoWrapRef.value.getBoundingClientRect();
      const { canvas, stopDrawing } = videoToCanvas({
        wrapSize: {
          width: rect.width,
          height: rect.height,
        },
        videoEl: newval,
        videoResize: ({ w, h }) => {
          videoHeight.value = `${w}x${h}`;
        },
      });
      stopDrawingArr.value.push(stopDrawing);
      remoteVideo.value.push(canvas);
      videoElArr.value.push(newval);
      videoLoading.value = false;
    }
  });

  function handleHlsPlay(url: string) {
    console.log('handleHlsPlay', url);
    handleStopDrawing();
    videoLoading.value = true;
    appStore.setLiveLine(LiveLineEnum.hls);
    startHlsPlay({
      hlsurl: url,
    });
  }

  watch(flvVideoEl, (newval) => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    if (newval && videoWrapRef.value) {
      const rect = videoWrapRef.value.getBoundingClientRect();
      const { canvas, stopDrawing } = videoToCanvas({
        wrapSize: {
          width: rect.width,
          height: rect.height,
        },
        videoEl: newval,
        videoResize: ({ w, h }) => {
          videoHeight.value = `${w}x${h}`;
        },
      });
      stopDrawingArr.value.push(stopDrawing);
      remoteVideo.value.push(canvas);
      videoElArr.value.push(newval);
      videoLoading.value = false;
    }
  });

  watch(
    () => networkStore.rtcMap,
    (newVal) => {
      if (newVal.size) {
        roomLiving.value = true;
        videoLoading.value = false;
      }
      if (
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_meeting_one ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_live ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.pk ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.tencent_css_pk
      ) {
        newVal.forEach((item) => {
          if (appStore.allTrack.find((v) => v.mediaName === item.receiver)) {
            return;
          }
          const rect = videoWrapRef.value?.getBoundingClientRect();
          if (rect) {
            videoFullBox({
              wrapSize: {
                width: rect.width,
                height: rect.height,
              },
              videoEl: item.videoEl,
              videoResize: ({ w, h }) => {
                videoHeight.value = `${w}x${h}`;
              },
            });
            remoteVideo.value.push(item.videoEl);
            videoElArr.value.push(item.videoEl);
          }
        });
      }
    },
    {
      deep: true,
      immediate: true,
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

  function handleFlvPlay() {
    console.log('handleFlvPlay');
    handleStopDrawing();
    videoLoading.value = true;
    appStore.setLiveLine(LiveLineEnum.flv);
    startFlvPlay({
      flvurl: flvurl.value,
    });
  }

  function handlePlay(data: ILiveRoom) {
    roomLiving.value = true;
    flvurl.value = data.flv_url!;
    hlsurl.value = data.hls_url!;
    switch (data.type) {
      case LiveRoomTypeEnum.srs:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.obs:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.msr:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.system:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.pk:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.wertc_live:
        appStore.setLiveLine(LiveLineEnum.rtc);
        break;
    }
  }

  watch(
    [() => roomLiving.value, () => appStore.liveRoomInfo],
    ([val, liveRoomInfo]) => {
      if (val && liveRoomInfo) {
        if (
          [
            LiveRoomTypeEnum.system,
            LiveRoomTypeEnum.msr,
            LiveRoomTypeEnum.srs,
            LiveRoomTypeEnum.obs,
            LiveRoomTypeEnum.tencent_css,
            LiveRoomTypeEnum.tencent_css_pk,
          ].includes(liveRoomInfo.type!)
        ) {
          handlePlay(liveRoomInfo!);
        } else if (LiveRoomTypeEnum.pk === liveRoomInfo.type!) {
          if (!route.query.pkKey) {
            handlePlay(liveRoomInfo!);
          }
        }
      } else {
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
      if (!roomLiving.value) {
        return;
      }
      switch (newVal) {
        case LiveLineEnum.flv:
          handleFlvPlay();
          break;
        case LiveLineEnum.hls:
          handleHlsPlay(hlsurl.value);
          break;
        case LiveLineEnum.rtc:
          break;
      }
    }
  );

  watch(
    () => cacheStore.muted,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        el.muted = newVal;
      });
      if (!newVal) {
        cacheStore.setVolume(cacheStore.volume || appStore.normalVolume);
      } else {
        cacheStore.setVolume(0);
      }
    }
  );

  watch(
    () => cacheStore.volume,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        el.volume = newVal / 100;
      });
      if (!newVal) {
        cacheStore.setMuted(true);
      } else {
        cacheStore.setMuted(false);
      }
    }
  );

  watch(
    () => appStore.playing,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        if (newVal) {
          el.play();
        } else {
          el.pause();
        }
      });
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

  function initPull(autolay = true) {
    autoplayVal.value = autolay;
    if (autoplayVal.value) {
      videoLoading.value = true;
    }
    initWs({
      roomId,
      isAnchor: false,
    });
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
      sendDanmu();
    }
  }

  function sendDanmu() {
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!danmuStr.value.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId);
    if (!instance) return;
    const requestId = getRandomString(8);
    const messageData: WsMessageType['data'] = {
      socket_id: '',
      msg: danmuStr.value,
      msgType: danmuMsgType.value,
      live_room_id: Number(roomId),
      msgIsFile: msgIsFile.value,
      send_msg_time: +new Date(),
      user_agent: navigator.userAgent,
    };
    instance.send({
      requestId,
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });

    danmuStr.value = '';
  }

  return {
    videoWrapRef,
    handlePlay,
    handleStopDrawing,
    initPull,
    closeWs,
    closeRtc,
    keydownDanmu,
    sendDanmu,
    handleSendGetLiveUser,
    danmuMsgType,
    isPlaying,
    msgIsFile,
    mySocketId,
    videoHeight,
    remoteVideo,
    roomLiving,
    autoplayVal,
    videoLoading,
    damuList,
    liveUserList,
    danmuStr,
    anchorInfo,
  };
}
