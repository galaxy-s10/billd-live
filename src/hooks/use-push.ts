import { getRandomString, windowReload } from 'billd-utils';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  fetchCreateUserLiveRoom,
  fetchUserHasLiveRoom,
} from '@/api/userLiveRoom';
import { DanmuMsgTypeEnum, ILiveRoom } from '@/interface';
import { WsMessageType, WsMsgTypeEnum, WsMsrBlobType } from '@/interface-ws';
import { handleMaxFramerate } from '@/network/webRTC';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { createVideo, generateBase64 } from '@/utils';

import { commentAuthTip, loginTip } from './use-login';
import { useSrsWs } from './use-srs-ws';
import { useTip } from './use-tip';

export function usePush() {
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const roomId = ref('');
  const roomName = ref('');
  const danmuStr = ref('');
  const liveRoomInfo = ref<ILiveRoom>();
  const localStream = ref<MediaStream>();
  const videoElArr = ref<HTMLVideoElement[]>([]);
  const msgIsFile = ref(false);

  const {
    roomLiving,
    isPull,
    initSrsWs,
    handleStartLive,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
  } = useSrsWs();
  isPull.value = false;

  watch(
    () => appStore.allTrack,
    (newTrack) => {
      console.log('appStore.allTrack变了');
      const mixedStream = new MediaStream();
      newTrack.forEach((item) => {
        if (item.track) {
          mixedStream.addTrack(item.track);
        }
      });
      console.log('新的allTrack音频轨', mixedStream.getAudioTracks());
      console.log('新的allTrack视频轨', mixedStream.getVideoTracks());
      console.log('旧的allTrack音频轨', localStream.value?.getAudioTracks());
      console.log('旧的allTrack视频轨', localStream.value?.getVideoTracks());
      // localStream.value = mixedStream;
    },
    { deep: true }
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

  // watch(
  //   () => currentMaxFramerate.value,
  //   () => {
  //     handleMaxFramerate({
  //       stream: canvasVideoStream.value!,
  //       height: currentResolutionRatio.value,
  //       frameRate: currentMaxFramerate.value,
  //     });
  //     console.log(currentMaxFramerate.value, 'kkkkkk');
  //     // networkStore.rtcMap.forEach(async (rtc) => {
  //     //   const res = await rtc.setMaxFramerate(newVal);
  //     //   if (res === 1) {
  //     //     window.$message.success('切换帧率成功！');
  //     //   } else {
  //     //     window.$message.success('切换帧率失败！');
  //     //   }
  //     // });
  //   }
  // );

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
        const res = await userHasLiveRoom();
        if (!res) {
          await useTip('你还没有直播间，是否立即开通？');
          await handleCreateUserLiveRoom();
        } else {
          roomName.value = liveRoomInfo.value?.name || '';
          roomId.value = `${liveRoomInfo.value?.id || ''}`;
          connectWs();
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
      networkStore.removeRtc(rtc.roomId);
    });
  }

  async function userHasLiveRoom() {
    const res = await fetchUserHasLiveRoom(userStore.userInfo?.id!);
    if (res.code === 200 && res.data) {
      liveRoomInfo.value = res.data.live_room;
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

  function connectWs() {
    initSrsWs({
      isAnchor: true,
      roomId: roomId.value,
      currentMaxBitrate: currentMaxBitrate.value,
      currentMaxFramerate: currentMaxFramerate.value,
      currentResolutionRatio: currentResolutionRatio.value,
    });
  }

  async function startLive({ type, receiver, chunkDelay }) {
    if (!loginTip()) return;
    const flag = await userHasLiveRoom();
    if (!flag) {
      await useTip('你还没有直播间，是否立即开通？');
      await handleCreateUserLiveRoom();
      return;
    }
    if (!roomNameIsOk()) {
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

    handleMaxFramerate({
      stream: canvasVideoStream.value!,
      height: currentResolutionRatio.value,
      frameRate: currentMaxFramerate.value,
    });
    handleStartLive({
      coverImg: lastCoverImg.value,
      name: roomName.value,
      type,
      receiver,
      chunkDelay,
    });
  }

  /** 结束直播 */
  function endLive() {
    roomLiving.value = false;
    localStream.value = undefined;
    const instance = networkStore.wsMap.get(roomId.value);
    if (instance) {
      instance.send({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.roomNoLive,
      });
    }
    closeRtc();
  }

  function sendBlob(data: { blob; blobId: string; delay }) {
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
        },
      });
    }
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
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!danmuStr.value.length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) {
      window.$message.error('还没开播，不能发送弹幕！');
      return;
    }
    instance.send<WsMessageType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.message,
      data: {
        msg: danmuStr.value,
        msgType: DanmuMsgTypeEnum.danmu,
        live_room_id: Number(roomId.value),
        msgIsFile: msgIsFile.value,
        sendMsgTime: +new Date(),
      },
    });
    damuList.value.push({
      socket_id: mySocketId.value,
      msgType: DanmuMsgTypeEnum.danmu,
      msg: danmuStr.value,
      userInfo: userStore.userInfo!,
      msgIsFile: msgIsFile.value,
      sendMsgTime: +new Date(),
    });
    danmuStr.value = '';
  }

  return {
    confirmRoomName,
    startLive,
    endLive,
    sendDanmu,
    keydownDanmu,
    sendBlob,
    msgIsFile,
    mySocketId,
    lastCoverImg,
    localStream,
    canvasVideoStream,
    roomLiving,
    currentResolutionRatio,
    currentMaxBitrate,
    currentMaxFramerate,
    danmuStr,
    roomName,
    damuList,
    liveUserList,
    liveRoomInfo,
  };
}
