import { Ref, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWs } from '@/hooks/use-ws';
import { DanmuMsgTypeEnum, IDanmu, IMessage, liveTypeEnum } from '@/interface';
import { WsMsgTypeEnum } from '@/network/webSocket';
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
  isSRS: boolean;
  liveType: liveTypeEnum;
}) {
  const route = useRoute();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const appStore = useAppStore();
  const roomId = ref(route.params.roomId as string);
  const roomLiveType = ref<liveTypeEnum>(liveType);
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

  const {
    getSocketId,
    initWs,
    roomLiveing,
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
    addTrack,
    delTrack,
  } = useWs();

  const { flvVideoEl, startFlvPlay } = useFlvPlay();
  const { hlsVideoEl, startHlsPlay } = useHlsPlay();

  async function handleHlsPlay() {
    console.log('handleHlsPlay');
    videoLoading.value = true;
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
  }

  async function handlePlay() {
    if (roomLiveType.value === liveTypeEnum.srsFlvPull) {
      console.log('srsFlvPull', autoplayVal.value);
      if (!autoplayVal.value) return;
      const { width, height } = await startFlvPlay({
        flvurl: flvurl.value,
      });
      videoToCanvas({
        videoEl: flvVideoEl.value!,
        targetEl: canvasRef.value!,
        width,
        height,
      });
      videoLoading.value = false;
    } else if (roomLiveType.value === liveTypeEnum.srsHlsPull) {
      console.log('srsHlsPull', autoplayVal.value);
      if (!autoplayVal.value) return;
      handleHlsPlay();
    }
  }

  watch(
    () => autoplayVal.value,
    (val) => {
      console.log('autoplayVal变了', val);
      if (val && roomLiveType.value === liveTypeEnum.webrtcPull) {
        handlePlay();
      }
    }
  );

  watch(
    () => roomLiveing.value,
    (val) => {
      console.log(val, roomLiveType.value, '-------');
      if (val) {
        flvurl.value = val.live?.live_room?.flv_url!;
        hlsurl.value = val.live?.live_room?.hls_url!;
        // if (val && roomLiveType.value === liveTypeEnum.webrtcPull) {
        handlePlay();
        // }
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
    () => localStream,
    (stream) => {
      if (stream.value) {
        console.log('localStream变了');
        console.log('音频轨：', stream.value?.getAudioTracks());
        console.log('视频轨：', stream.value?.getVideoTracks());
        if (roomLiveType.value === liveTypeEnum.webrtcPull) {
          videoElArr.value.forEach((dom) => {
            dom.remove();
          });
          stream.value?.getVideoTracks().forEach((track) => {
            console.log('视频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            canvasRef.value?.appendChild(video);
            videoElArr.value.push(video);
          });
          stream.value?.getAudioTracks().forEach((track) => {
            console.log('音频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            canvasRef.value?.appendChild(video);
            videoElArr.value.push(video);
          });
          videoLoading.value = false;
        } else if (roomLiveType.value === liveTypeEnum.srsWebrtcPull) {
          videoElArr.value.forEach((dom) => {
            dom.remove();
          });
          stream.value?.getVideoTracks().forEach((track) => {
            console.log('视频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            // document.body.appendChild(video);
            // console.log('kkkk', video);
            canvasRef.value?.appendChild(video);
            videoElArr.value.push(video);
          });
          stream.value?.getAudioTracks().forEach((track) => {
            console.log('音频轨enabled：', track.id, track.enabled);
            const video = createVideo({});
            video.setAttribute('track-id', track.id);
            video.srcObject = new MediaStream([track]);
            canvasRef.value?.appendChild(video);
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
    initWs({
      roomId: roomId.value,
      isSRS,
      isAnchor: false,
      isPull: true,
      roomLiveType: roomLiveType.value,
    });
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

  function addVideo() {
    sidebarList.value.push({ socketId: getSocketId() });
    nextTick(() => {
      liveUserList.value.forEach((item) => {
        const socketId = item.id;
        if (socketId === getSocketId()) {
          localVideoRef.value[getSocketId()].srcObject = localStream.value;
        }
      });
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

  return {
    initPull,
    closeWs,
    closeRtc,
    getSocketId,
    keydownDanmu,
    sendDanmu,
    addVideo,
    handleHlsPlay,
    roomLiveType,
    roomLiveing,
    autoplayVal,
    videoLoading,
    roomNoLive,
    damuList,
    liveUserList,
    sidebarList,
    danmuStr,
    liveRoomInfo,
  };
}
