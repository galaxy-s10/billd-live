import { getRandomString, windowReload } from 'billd-utils';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { fetchCreateUserLiveRoom } from '@/api/userLiveRoom';
import { loginTip } from '@/hooks/use-login';
import { useTip } from '@/hooks/use-tip';
import { useWebsocket } from '@/hooks/use-websocket';
import { WsMessageIsFileEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import {
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  WsMsrBlobType,
  WsRoomNoLiveType,
} from '@/types/websocket';
import { createVideo, generateBase64 } from '@/utils';
import { handlConstraints } from '@/utils/network/webRTC';

export function usePush() {
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const roomId = ref('');
  const danmuStr = ref('');
  const localStream = ref<MediaStream>();
  const videoElArr = ref<HTMLVideoElement[]>([]);
  const msgIsFile = ref<WsMessageIsFileEnum>(WsMessageIsFileEnum.no);

  const {
    keepRtcLivingTimer,
    roomLiving,
    initWs,
    handleStartLive,
    sendDanmuTxt,
    connectStatus,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
    currentAudioContentHint,
    currentVideoContentHint,
  } = useWebsocket();

  onMounted(() => {
    if (!loginTip()) return;
  });

  onUnmounted(() => {
    closeWs();
    closeRtc();
  });

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

  watch(
    () => currentResolutionRatio.value,
    (newval) => {
      console.log('分辨率变了', newval);
      networkStore.rtcMap.forEach((rtc) => {
        if (canvasVideoStream.value) {
          handlConstraints({
            frameRate: rtc.maxFramerate,
            height: newval,
            stream: canvasVideoStream.value,
          });
        }
      });
    }
  );

  watch(
    () => currentMaxFramerate.value,
    (newval) => {
      console.log('帧率变了', newval);
      networkStore.rtcMap.forEach((rtc) => {
        if (canvasVideoStream.value) {
          handlConstraints({
            frameRate: newval,
            height: rtc.resolutionRatio,
            stream: canvasVideoStream.value,
          });
        }
      });
    }
  );

  watch(
    () => currentMaxBitrate.value,
    (newval) => {
      console.log('码率变了', newval);
      networkStore.rtcMap.forEach(async (rtc) => {
        const res = await rtc.setMaxBitrate(newval);
        if (res === 1) {
          window.$message.success('切换码率成功！');
        } else {
          window.$message.success('切换码率失败！');
        }
      });
    }
  );

  watch(
    () => localStream.value,
    (stream) => {
      console.log('localStream变了');
      console.log('音频轨：', stream?.getAudioTracks());
      console.log('视频轨：', stream?.getVideoTracks());
      videoElArr.value.forEach((dom) => {
        dom.remove();
      });
      stream?.getVideoTracks().forEach((track) => {
        console.log('视频轨enabled：', track.id, track.enabled);
        const video = createVideo({});
        video.setAttribute('track-id', track.id);
        video.srcObject = new MediaStream([track]);
        videoElArr.value.push(video);
      });
      stream?.getAudioTracks().forEach((track) => {
        console.log('音频轨enabled：', track.id, track.enabled);
        const video = createVideo({});
        video.setAttribute('track-id', track.id);
        video.srcObject = new MediaStream([track]);
        videoElArr.value.push(video);
      });
    },
    { deep: true }
  );

  watch(
    () => userStore.userInfo,
    async (newVal) => {
      if (newVal) {
        const res = handleUserHasLiveRoom();
        if (!res) {
          await useTip({
            content: '你还没有直播间，是否立即开通？',
            maskClosable: false,
          });
          await handleCreateUserLiveRoom();
        } else {
          roomId.value = `${appStore.liveRoomInfo?.id || ''}`;
          connectWs();
        }
      }
    },
    { immediate: true }
  );

  function handleUserHasLiveRoom() {
    const res = userStore.userInfo?.live_rooms?.[0];
    appStore.liveRoomInfo = res;
    return res;
  }

  async function handleCreateUserLiveRoom() {
    try {
      const res = await fetchCreateUserLiveRoom();
      if (res.code === 200) {
        window.$message.success('开通直播间成功！');
        setTimeout(() => {
          windowReload();
        }, 500);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function connectWs() {
    initWs({
      isAnchor: true,
      roomId: roomId.value,
      currentMaxBitrate: currentMaxBitrate.value,
      currentMaxFramerate: currentMaxFramerate.value,
      currentResolutionRatio: currentResolutionRatio.value,
    });
  }

  async function startLive({ type, cdn, isdev, msrDelay, msrMaxDelay }) {
    if (!loginTip()) return;
    const flag = handleUserHasLiveRoom();
    if (!flag) {
      await useTip({
        content: '你还没有直播间，是否立即开通？',
        maskClosable: false,
      });
      await handleCreateUserLiveRoom();
      return;
    }
    if (connectStatus.value !== WsConnectStatusEnum.connect) {
      window.$message.warning('websocket未连接');
      return;
    }
    roomLiving.value = true;
    const el = appStore.allTrack.find((item) => {
      if (item.video === 1) {
        return true;
      }
    });
    if (el) {
      const res1 = videoElArr.value.find(
        (item) => item.getAttribute('track-id') === el.track?.id
      );
      if (res1) {
        // canvas推流的话，不需要再设置预览图了
        if (!canvasVideoStream.value) {
          lastCoverImg.value = generateBase64(res1);
        }
      }
    }
    if (canvasVideoStream.value) {
      handlConstraints({
        stream: canvasVideoStream.value,
        height: currentResolutionRatio.value,
        frameRate: currentMaxFramerate.value,
      });
    }
    handleStartLive({ cdn, isdev, type, msrDelay, msrMaxDelay });
  }

  /** 结束直播 */
  function endLive() {
    roomLiving.value = false;
    localStream.value = undefined;
    closeRtc();
    clearInterval(keepRtcLivingTimer.value);
  }

  function sendRoomNoLive() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (instance) {
      instance.send<WsRoomNoLiveType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.roomNoLive,
        data: {
          live_room_id: appStore.liveRoomInfo?.id!,
        },
      });
    }
  }

  function sendBlob(data: { blob; blobId: string; delay; max_delay }) {
    const instance = networkStore.wsMap.get(roomId.value);
    if (instance) {
      instance.send<WsMsrBlobType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.msrBlob,
        data: {
          live_room_id: Number(roomId.value),
          blob: data.blob,
          blob_id: data.blobId,
          delay: data.delay,
          max_delay: data.max_delay,
        },
      });
    }
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      sendDanmuTxt(danmuStr.value);
      danmuStr.value = '';
    }
  }

  return {
    startLive,
    endLive,
    keydownDanmu,
    sendBlob,
    sendRoomNoLive,
    roomId,
    msgIsFile,
    mySocketId,
    lastCoverImg,
    localStream,
    canvasVideoStream,
    roomLiving,
    currentResolutionRatio,
    currentMaxBitrate,
    currentMaxFramerate,
    currentAudioContentHint,
    currentVideoContentHint,
    danmuStr,
    damuList,
    liveUserList,
  };
}
