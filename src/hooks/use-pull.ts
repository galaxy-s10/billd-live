import { onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useSrsWs } from '@/hooks/use-srs-ws';
import {
  DanmuMsgTypeEnum,
  IDanmu,
  IMessage,
  LiveRoomTypeEnum,
} from '@/interface';
import { WsMsgTypeEnum } from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, videoToCanvas } from '@/utils';

export function usePull() {
  const route = useRoute();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const appStore = useAppStore();
  const roomId = ref(route.params.roomId as string);
  const localStream = ref<MediaStream>();
  const danmuStr = ref('');
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const flvurl = ref('');
  const hlsurl = ref('');
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
    liveRoomInfo,
    anchorInfo,
    liveUserList,
    damuList,
  } = useSrsWs();
  isPull.value = true;
  const { flvVideoEl, startFlvPlay, destroyFlv } = useFlvPlay();
  const { hlsVideoEl, startHlsPlay, destroyHls } = useHlsPlay();
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

  watch(hlsVideoEl, () => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    const { canvas, stopDrawing } = videoToCanvas({
      videoEl: hlsVideoEl.value!,
    });
    stopDrawingArr.value.push(stopDrawing);
    remoteVideo.value.push(canvas);
    videoLoading.value = false;
  });

  function handleHlsPlay(url?: string) {
    console.log('handleHlsPlay', url);
    handleStopDrawing();
    videoLoading.value = true;
    startHlsPlay({
      hlsurl: url || hlsurl.value,
    });
  }

  watch(flvVideoEl, () => {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    const { canvas, stopDrawing } = videoToCanvas({
      videoEl: flvVideoEl.value!,
    });
    stopDrawingArr.value.push(stopDrawing);
    remoteVideo.value.push(canvas);
    videoLoading.value = false;
  });

  function handleFlvPlay() {
    console.log('handleFlvPlay');
    handleStopDrawing();
    videoLoading.value = true;
    startFlvPlay({
      flvurl: flvurl.value,
    });
  }

  async function handlePlay() {
    console.warn('handlePlay');
    if (liveRoomInfo.value?.type !== LiveRoomTypeEnum.user_wertc) {
      if (!autoplayVal.value) return;
      // await handleFlvPlay();
      await handleHlsPlay();
    }
  }

  watch(
    () => roomLiving.value,
    (val) => {
      if (val) {
        if (liveRoomInfo.value?.type !== LiveRoomTypeEnum.user_wertc) {
          flvurl.value = liveRoomInfo.value?.flv_url!;
          hlsurl.value = liveRoomInfo.value?.hls_url!;
          handlePlay();
        }
      } else {
        closeRtc();
        handleStopDrawing();
      }
    }
  );

  watch(
    () => appStore.muted,
    (newVal) => {
      console.log('muted变了', newVal);
      videoElArr.value.forEach((el) => {
        el.muted = newVal;
      });
    }
  );

  watch(
    () => networkStore.rtcMap,
    (newVal) => {
      if (liveRoomInfo.value?.type === LiveRoomTypeEnum.user_wertc) {
        newVal.forEach((item) => {
          videoLoading.value = false;
          const { canvas } = videoToCanvas({
            videoEl: item.videoEl,
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
        if (liveRoomInfo.value?.type === LiveRoomTypeEnum.user_wertc) {
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
      () => networkStore.wsMap.get(roomId.value)?.socketIo?.connected,
    ],
    ([userInfo, connected]) => {
      if (userInfo && connected) {
        const instance = networkStore.wsMap.get(roomId.value);
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
      roomId: roomId.value,
      isAnchor: false,
    });
  }

  function closeWs() {
    const instance = networkStore.wsMap.get(roomId.value);
    instance?.close();
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      rtc.close();
      networkStore.removeRtc(rtc.roomId);
    });
  }

  function addVideo() {
    sidebarList.value.push({ socketId: mySocketId.value });
    // nextTick(() => {
    //   liveUserList.value.forEach((item) => {
    //     const socketId = item.id;
    //     if (socketId === mySocketId.value) {
    //       remoteVideoRef.value[mySocketId.value].srcObject = localStream.value;
    //     }
    //   });
    // });
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
      socket_id: mySocketId.value,
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

  return {
    handleStopDrawing,
    initPull,
    closeWs,
    closeRtc,
    mySocketId,
    keydownDanmu,
    sendDanmu,
    addVideo,
    handleHlsPlay,
    handleFlvPlay,
    remoteVideo,
    roomLiving,
    autoplayVal,
    videoLoading,
    damuList,
    liveUserList,
    sidebarList,
    danmuStr,
    liveRoomInfo,
    anchorInfo,
  };
}
