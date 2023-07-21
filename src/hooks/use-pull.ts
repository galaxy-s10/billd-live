import { Ref, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWs } from '@/hooks/use-ws';
import {
  DanmuMsgTypeEnum,
  IDanmu,
  IMessage,
  IUpdateJoinInfo,
  liveTypeEnum,
} from '@/interface';
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
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();
  const roomId = ref(route.params.roomId as string);
  const roomLiveType = ref<liveTypeEnum>(liveType);
  const flvurl = ref('');
  const hlsurl = ref('');
  const danmuStr = ref('');
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const sidebarList = ref<
    {
      socketId: string;
    }[]
  >([]);

  const {
    getSocketId,
    initWs,
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

  watch(
    () => localStream,
    async (stream) => {
      if (stream.value) {
        if (roomLiveType.value === liveTypeEnum.srsFlvPull) {
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
        } else if (roomLiveType.value === liveTypeEnum.webrtcPull) {
          const videoEl = createVideo({
            muted: appStore.muted,
            autoplay: true,
          });
          videoEl.srcObject = stream.value;
          canvasRef.value?.childNodes?.forEach((item) => {
            item.remove();
          });
          canvasRef.value?.appendChild(videoEl);
          videoLoading.value = false;
        } else {
          canvasRef.value?.childNodes?.forEach((item) => {
            item.remove();
          });
        }
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
        const data: IUpdateJoinInfo['data'] = {
          live_room_id: Number(roomId.value),
        };
        instance.send({
          msgType: WsMsgTypeEnum.updateJoinInfo,
          data,
        });
      }
    }
  );

  function initPull(autolay = true) {
    autoplayVal.value = autolay;
    if (autoplayVal.value) {
      videoLoading.value = true;
    }
    initWs({ roomId: roomId.value, isSRS, isAnchor: false });
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
      liveUserList.value.forEach(async (item) => {
        const socketId = item.id;
        console.log(item, 333);
        if (socketId === getSocketId()) {
          localVideoRef.value[getSocketId()].srcObject = localStream.value;
        }
        // if (!offerSended.value.has(socketId)) {
        //   hooksRtcMap.value.add(
        //     await startNewWebRtc({
        //       receiver: socketId,
        //       videoEl: localVideoRef.value[socketId],
        //     })
        //   );
        //   console.log('执行sendOffer', {
        //     sender: getSocketId(),
        //     receiver: socketId,
        //   });
        //   sendOffer({ sender: getSocketId(), receiver: socketId });
        //   offerSended.value.add(socketId);
        // }
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
