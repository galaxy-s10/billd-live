import { getRandomString } from 'billd-utils';
import { onUnmounted, ref, watch } from 'vue';

import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  DanmuMsgTypeEnum,
  IDanmu,
  ILiveRoom,
  LiveLineEnum,
  LiveRoomTypeEnum,
} from '@/interface';
import { WsMessageType, WsMsgTypeEnum } from '@/interface-ws';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, videoToCanvas } from '@/utils';

export function usePull(roomId: string) {
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const localStream = ref<MediaStream>();
  const danmuStr = ref('');
  const msgIsFile = ref(false);
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const isPlaying = ref(false);
  const flvurl = ref('');
  const hlsurl = ref('');
  const videoHeight = ref();
  const sidebarList = ref<
    {
      socketId: string;
    }[]
  >([]);
  const videoElArr = ref<HTMLVideoElement[]>([]);
  const remoteVideo = ref<HTMLElement[]>([]);
  const {
    isPull,
    mySocketId,
    initSrsWs,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
  } = useWebsocket();
  isPull.value = true;
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

  watch(
    () => appStore.pkStream,
    (newval) => {
      console.log('pkStream变了', newval);
      stopDrawingArr.value = [];
      stopDrawingArr.value.forEach((cb) => cb());
      console.log(
        networkStore.getRtcMap(`${mySocketId.value}___${roomId}`)?.videoEl!
      );
      const { canvas, stopDrawing } = videoToCanvas({
        videoEl: networkStore.getRtcMap(`${mySocketId.value}___${roomId}`)
          ?.videoEl!,
        resize: ({ w, h }) => {
          videoHeight.value = `${w}x${h}`;
        },
      });
      console.log(canvas);
      document.body.appendChild(canvas);
      stopDrawingArr.value.push(stopDrawing);
      remoteVideo.value.push(canvas);
      roomLiving.value = true;
      videoLoading.value = false;
    }
  );

  watch(hlsVideoEl, () => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    const { canvas, stopDrawing } = videoToCanvas({
      videoEl: hlsVideoEl.value!,
      resize: ({ w, h }) => {
        videoHeight.value = `${w}x${h}`;
      },
    });
    stopDrawingArr.value.push(stopDrawing);
    remoteVideo.value.push(canvas);
    videoLoading.value = false;
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

  watch(flvVideoEl, () => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    const { canvas, stopDrawing } = videoToCanvas({
      videoEl: flvVideoEl.value!,
      resize: ({ w, h }) => {
        videoHeight.value = `${w}x${h}`;
      },
    });
    stopDrawingArr.value.push(stopDrawing);
    remoteVideo.value.push(canvas);
    videoLoading.value = false;
  });

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
      case LiveRoomTypeEnum.user_srs:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.user_obs:
        if (appStore.liveLine === LiveLineEnum.flv) {
          handleFlvPlay();
        } else if (appStore.liveLine === LiveLineEnum.hls) {
          handleHlsPlay(data.hls_url!);
        }
        break;
      case LiveRoomTypeEnum.user_msr:
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
      case LiveRoomTypeEnum.user_wertc:
        appStore.setLiveLine(LiveLineEnum.rtc);
        break;
    }
  }

  watch(
    () => roomLiving.value,
    (val) => {
      if (val) {
        if (appStore.liveRoomInfo?.type !== LiveRoomTypeEnum.user_wertc) {
          handlePlay(appStore.liveRoomInfo!);
        }
      } else {
        closeRtc();
        handleStopDrawing();
      }
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
    () => appStore.play,
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

  watch(
    () => networkStore.rtcMap,
    (newVal) => {
      if (appStore.liveRoomInfo?.type === LiveRoomTypeEnum.user_wertc) {
        newVal.forEach((item) => {
          videoLoading.value = false;
          const { canvas } = videoToCanvas({
            videoEl: item.videoEl,
            resize: ({ w, h }) => {
              videoHeight.value = `${w}x${h}`;
            },
          });
          videoElArr.value.push(item.videoEl);
          remoteVideo.value.push(canvas);
        });
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => localStream.value,
    (val) => {
      if (val) {
        console.log('localStream变了');
        console.log('音频轨：', val?.getAudioTracks());
        console.log('视频轨：', val?.getVideoTracks());
        if (appStore.liveRoomInfo?.type === LiveRoomTypeEnum.user_wertc) {
          videoElArr.value.forEach((dom) => {
            dom.remove();
          });
          val?.getVideoTracks().forEach((track) => {
            console.log('视频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            remoteVideo.value.push(video);
            videoElArr.value.push(video);
          });
          val?.getAudioTracks().forEach((track) => {
            console.log('音频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            remoteVideo.value.push(video);
            videoElArr.value.push(video);
          });
          videoLoading.value = false;
        } else {
          videoElArr.value.forEach((dom) => {
            dom.remove();
          });
          val?.getVideoTracks().forEach((track) => {
            console.log('视频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            remoteVideo.value.push(video);
            videoElArr.value.push(video);
          });
          val?.getAudioTracks().forEach((track) => {
            console.log('音频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            remoteVideo.value.push(video);
            videoElArr.value.push(video);
          });
          videoLoading.value = false;
        }
      } else {
        videoElArr.value?.forEach((item) => {
          item.remove();
        });
      }
    },
    { deep: true }
  );

  watch(
    [
      () => userStore.userInfo,
      () => networkStore.wsMap.get(roomId)?.socketIo?.connected,
    ],
    ([userInfo, connected]) => {
      if (userInfo && connected) {
        const instance = networkStore.wsMap.get(roomId);
        if (!instance) return;
      }
    }
  );

  function initPull(autolay = true) {
    autoplayVal.value = autolay;
    if (autoplayVal.value) {
      videoLoading.value = true;
    }
    initSrsWs({
      roomId,
      isAnchor: false,
    });
  }

  function closeWs() {
    networkStore.wsMap.forEach((ws) => {
      ws.close();
      networkStore.removeWs(ws.roomId);
    });
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      rtc.close();
      networkStore.removeRtc(rtc.roomId);
    });
  }

  function addVideo() {
    sidebarList.value.push({ socketId: mySocketId.value });
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
    const danmu: IDanmu = {
      request_id: requestId,
      socket_id: mySocketId.value,
      userInfo: userStore.userInfo!,
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
      msgIsFile: msgIsFile.value,
      sendMsgTime: +new Date(),
    };
    const messageData: WsMessageType['data'] = {
      msg: danmuStr.value,
      msgType: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId),
      msgIsFile: msgIsFile.value,
      sendMsgTime: +new Date(),
    };
    instance.send({
      requestId,
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
    damuList.value.push(danmu);
    danmuStr.value = '';
  }

  return {
    handlePlay,
    handleStopDrawing,
    initPull,
    closeWs,
    closeRtc,
    keydownDanmu,
    sendDanmu,
    addVideo,
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
    sidebarList,
    danmuStr,
    anchorInfo,
  };
}
