import { windowReload } from 'billd-utils';
import { Ref, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  fetchCreateUserLiveRoom,
  fetchUserHasLiveRoom,
} from '@/api/userLiveRoom';
import {
  DanmuMsgTypeEnum,
  IMessage,
  MediaTypeEnum,
  liveTypeEnum,
} from '@/interface';
import { WsMsgTypeEnum } from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, generateBase64 } from '@/utils';

import { loginTip } from './use-login';
import { useTip } from './use-tip';
import { useWs } from './use-ws';

export function usePush({
  localVideoRef,
  remoteVideoRef,
  isSRS,
}: {
  localVideoRef: Ref<HTMLVideoElement | undefined>;
  remoteVideoRef: Ref<HTMLVideoElement[]>;
  isSRS: boolean;
}) {
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const roomId = ref('');
  const roomName = ref('');
  const danmuStr = ref('');
  const isLiving = ref(false);
  const videoElArr = ref<HTMLVideoElement[]>([]);

  const allMediaTypeList: {
    [index: string]: { type: MediaTypeEnum; txt: string };
  } = {
    [MediaTypeEnum.camera]: {
      type: MediaTypeEnum.camera,
      txt: '摄像头',
    },
    [MediaTypeEnum.screen]: {
      type: MediaTypeEnum.screen,
      txt: '窗口',
    },
    [MediaTypeEnum.microphone]: {
      type: MediaTypeEnum.microphone,
      txt: '麦克风',
    },
  };

  const {
    getSocketId,
    initWs,
    canvasVideoStream,
    lastCoverImg,
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
        localVideoRef.value?.appendChild(video);
        videoElArr.value.push(video);
      });
      stream?.getAudioTracks().forEach((track) => {
        console.log('音频轨enabled：', track.id, track.enabled);
        const video = createVideo({});
        video.setAttribute('track-id', track.id);
        video.srcObject = new MediaStream([track]);
        localVideoRef.value?.appendChild(video);
        videoElArr.value.push(video);
      });
    },
    { deep: true }
  );

  watch(
    () => userStore.userInfo,
    async (newVal) => {
      if (newVal) {
        const res = await userHasLiveRoom();
        if (!res) {
          await useTip('你还没有直播间，是否立即开通？');
          await handleCreateUserLiveRoom();
        }
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    roomId.value = route.query.roomId as string;
    if (!loginTip()) return;
  });

  onUnmounted(() => {
    closeWs();
    closeRtc();
  });

  function closeWs() {
    const instance = networkStore.wsMap.get(roomId.value);
    instance?.close();
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      rtc.close();
    });
  }

  async function userHasLiveRoom() {
    const res = await fetchUserHasLiveRoom(userStore.userInfo?.id!);
    if (res.code === 200 && res.data) {
      roomName.value = res.data.live_room?.name || '';
      roomId.value = `${res.data.live_room?.id || ''}`;
      router.push({ query: { ...route.query, roomId: roomId.value } });
      return true;
    }
    return false;
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

  async function startLive() {
    if (!loginTip()) return;
    const flag = await userHasLiveRoom();
    if (!flag) {
      await useTip('你还没有直播间，是否立即开通？');
      await handleCreateUserLiveRoom();
      return;
    }
    if (!roomNameIsOk()) return;
    if (appStore.allTrack.length <= 0) {
      window.$message.warning('请选择一个素材！');
      return;
    }
    isLiving.value = true;
    const el = appStore.allTrack.find((item) => {
      if (item.video === 1) {
        return true;
      }
    });
    if (el) {
      const res1 = videoElArr.value.find(
        (item) => item.getAttribute('track-id') === el.track.id
      );
      if (res1) {
        // canvas推流的话，不需要再设置预览图了
        if (!canvasVideoStream.value) {
          lastCoverImg.value = generateBase64(res1);
        }
      }
    }
    initWs({
      isAnchor: true,
      roomId: roomId.value,
      isSRS,
      isPull: false,
      currentMaxBitrate: currentMaxBitrate.value,
      currentMaxFramerate: currentMaxFramerate.value,
      currentResolutionRatio: currentResolutionRatio.value,
      roomLiveType: isSRS ? liveTypeEnum.srsPush : liveTypeEnum.webrtcPush,
    });
    return;
  }

  /** 结束直播 */
  function endLive() {
    isLiving.value = false;
    localStream.value = undefined;
    clearInterval(heartbeatTimer.value);
    const instance = networkStore.wsMap.get(roomId.value);
    if (instance) {
      instance.send({
        msgType: WsMsgTypeEnum.roomNoLive,
        data: {},
      });
    }
    setTimeout(() => {
      closeWs();
      closeRtc();
    }, 500);
  }

  function roomNameIsOk() {
    if (!roomName.value.length) {
      window.$message.warning('请输入房间名！');
      return false;
    }
    if (roomName.value.length < 3 || roomName.value.length > 30) {
      window.$message.warning('房间名要求3-30个字符！');
      return false;
    }
    return true;
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      sendDanmu();
    }
  }

  function confirmRoomName() {
    if (!roomNameIsOk()) return;
  }

  function sendDanmu() {
    if (!danmuStr.value.length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) {
      window.$message.error('还没开播，不能发送弹幕！');
      return;
    }
    const messageData: IMessage['data'] = {
      msg: danmuStr.value,
      msgType: DanmuMsgTypeEnum.danmu,
      live_room_id: Number(roomId.value),
    };
    instance.send({
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });
    damuList.value.push({
      socket_id: getSocketId(),
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
      userInfo: userStore.userInfo,
    });
    danmuStr.value = '';
  }

  return {
    confirmRoomName,
    getSocketId,
    startLive,
    endLive,
    sendDanmu,
    keydownDanmu,
    lastCoverImg,
    localStream,
    canvasVideoStream,
    isLiving,
    allMediaTypeList,
    currentResolutionRatio,
    currentMaxBitrate,
    currentMaxFramerate,
    resolutionRatio,
    maxBitrate,
    maxFramerate,
    danmuStr,
    roomName,
    damuList,
    liveUserList,
    addTrack,
    delTrack,
  };
}
