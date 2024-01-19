<template>
  <div class="push-wrap">
    <div
      ref="topRef"
      class="left"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <canvas
          id="pushCanvasRef"
          ref="pushCanvasRef"
        ></canvas>
        <div
          v-if="appStore.allTrack.filter((item) => !item.hidden).length <= 0"
          class="add-wrap"
        >
          <n-space>
            <n-button
              v-for="(item, index) in allMediaTypeList"
              :key="index"
              class="item"
              @click="handleStartMedia(item)"
            >
              {{ item.txt }}
            </n-button>
          </n-space>
        </div>
      </div>

      <div
        ref="bottomRef"
        class="room-control"
      >
        <div class="info">
          <div
            class="avatar"
            :style="{ backgroundImage: `url(${userStore.userInfo?.avatar})` }"
          ></div>
          <div class="detail">
            <div class="top">
              <n-input-group>
                <n-input
                  v-model:value="roomName"
                  size="small"
                  placeholder="输入房间名"
                  :style="{ width: '50%' }"
                />
                <n-button
                  size="small"
                  type="primary"
                  @click="confirmRoomName"
                >
                  确定
                </n-button>
              </n-input-group>
            </div>
            <div class="bottom">
              <span v-if="NODE_ENV === 'development'">
                {{ mySocketId }}
              </span>
            </div>
          </div>
        </div>
        <div class="rtc">
          <div class="item">
            <div class="txt">码率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentMaxBitrate"
                :options="maxBitrate"
              />
            </div>
          </div>
          <div class="item">
            <div class="txt">帧率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentMaxFramerate"
                :options="maxFramerate"
              />
            </div>
          </div>
          <div class="item">
            <div class="txt">分辨率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentResolutionRatio"
                :options="resolutionRatio"
              />
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <span class="item">
              <i class="ico"></i>
              <span>
                正在观看：
                {{
                  liveUserList.filter((item) => item.id !== mySocketId).length
                }}
              </span>
            </span>
          </div>
          <div class="bottom">
            <n-button
              v-if="!roomLiving"
              type="info"
              size="small"
              @click="handleStartLive"
            >
              开始直播
            </n-button>
            <n-button
              v-else
              type="error"
              size="small"
              @click="handleEndLive"
            >
              结束直播
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="resource-card">
        <div class="title">素材列表</div>
        <div class="list">
          <div
            v-for="(item, index) in appStore.allTrack.filter(
              (item) => !item.hidden
            )"
            :key="index"
            class="item"
          >
            <span class="name">
              {{ NODE_ENV === 'development' ? item.id : '' }}({{
                mediaTypeEnumMap[item.type]
              }}){{ item.mediaName }}
            </span>
            <div class="control">
              <div
                v-if="item.audio === 1"
                class="control-item"
                @click="handleChangeMuted(item)"
              >
                <n-popover
                  placement="top"
                  trigger="hover"
                  :flip="false"
                >
                  <template #trigger>
                    <n-icon size="16">
                      <VolumeMuteOutline v-if="item.muted"></VolumeMuteOutline>
                      <VolumeHighOutline v-else></VolumeHighOutline>
                    </n-icon>
                  </template>
                  <div class="slider">
                    <n-slider
                      :value="item.volume"
                      :step="1"
                      @update-value="(v) => handleChangeVolume(item, v)"
                    />
                  </div>
                </n-popover>
              </div>
              <div
                class="control-item"
                @click="handleEdit(item)"
              >
                <n-icon size="16">
                  <CreateOutline></CreateOutline>
                </n-icon>
              </div>
              <div
                class="control-item"
                @click="handleDel(item)"
              >
                <n-icon size="16">
                  <Close></Close>
                </n-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <n-button
            size="small"
            type="primary"
            @click="showSelectMediaModalCpt = true"
          >
            添加素材
          </n-button>
        </div>
      </div>
      <div class="danmu-card">
        <div class="title">弹幕互动</div>
        <div class="list-wrap">
          <div
            ref="danmuListRef"
            class="list"
          >
            <div
              v-for="(item, index) in damuList"
              :key="index"
              class="item"
            >
              <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
                <span class="name">
                  <span v-if="item.userInfo">
                    {{ item.userInfo.username }}[{{
                      item.userInfo.roles?.map((v) => v.role_name).join()
                    }}]
                  </span>
                  <span v-else>{{ item.socket_id }}[游客]</span>
                </span>
                <span>：</span>
                <span
                  class="msg"
                  v-if="!item.msgIsFile"
                >
                  {{ item.msg }}
                </span>
                <div
                  class="msg img"
                  v-else
                >
                  <img
                    :src="item.msg"
                    alt=""
                    @load="handleScrollTop"
                  />
                </div>
              </template>
              <template v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin">
                <span class="name system">系统通知：</span>
                <span class="msg">
                  <span>{{ item.userInfo?.username || item.socket_id }}</span>
                  <span>进入直播！</span>
                </span>
              </template>
              <template
                v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved"
              >
                <span class="name system">系统通知：</span>
                <span class="msg">
                  <span>{{ item.userInfo?.username || item.socket_id }}</span>
                  <span>离开直播！</span>
                </span>
              </template>
            </div>
          </div>
        </div>
        <div
          class="send-msg"
          v-loading="msgLoading"
        >
          <div class="control">
            <div
              class="ico face"
              title="表情"
              @click="handleWait"
            ></div>
            <div
              class="ico img"
              title="图片"
              @click="mockClick"
            >
              <input
                ref="uploadRef"
                type="file"
                class="input-upload"
                accept=".webp,.png,.jpg,.jpeg,.gif"
                @change="uploadChange"
              />
            </div>
          </div>
          <textarea
            v-model="danmuStr"
            class="ipt"
            @keydown="keydownDanmu"
          ></textarea>
          <div
            class="btn"
            @click="sendDanmu"
          >
            发送
          </div>
        </div>
        <!-- <div class="send-msg">
          <input
            v-model="danmuStr"
            class="ipt"
            @keydown="keydownDanmu"
          />
          <n-button
            type="info"
            size="small"
            @click="sendDanmu"
          >
            发送
          </n-button>
        </div> -->
      </div>
    </div>

    <SelectMediaModalCpt
      v-if="showSelectMediaModalCpt"
      :all-media-type-list="allMediaTypeList"
      @close="showSelectMediaModalCpt = false"
      @ok="handleShowMediaModalCpt"
    ></SelectMediaModalCpt>

    <MediaModalCpt
      v-if="showMediaModalCpt"
      :is-edit="isEdit"
      :media-type="currentMediaType"
      :init-data="currentMediaData"
      @close="showMediaModalCpt = false"
      @add-ok="addMediaOk"
      @edit-ok="editMediaOk"
    ></MediaModalCpt>

    <OpenMicophoneTipCpt
      v-if="showOpenMicophoneTipCpt"
      @close="showOpenMicophoneTipCpt = false"
    ></OpenMicophoneTipCpt>

    <NoLiveTipModalCpt
      v-if="showNoLiveTipModalCpt"
      @close="showNoLiveTipModalCpt = false"
    ></NoLiveTipModalCpt>
  </div>
</template>

<script lang="ts" setup>
import {
  Close,
  CreateOutline,
  VolumeHighOutline,
  VolumeMuteOutline,
} from '@vicons/ionicons5';
import { fabric } from 'fabric';
import {
  Raw,
  markRaw,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import * as workerTimers from 'worker-timers';

import { QINIU_LIVE, mediaTypeEnumMap } from '@/constant';
import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { usePush } from '@/hooks/use-push';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useUpload } from '@/hooks/use-upload';
import { DanmuMsgTypeEnum, LiveRoomTypeEnum, MediaTypeEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import {
  createVideo,
  formatDownTime,
  generateBase64,
  getRandomEnglishString,
  readFile,
  saveFile,
} from '@/utils';
import { NODE_ENV } from 'script/constant';

import MediaModalCpt from './mediaModal/index.vue';
import NoLiveTipModalCpt from './noLiveTipModal/index.vue';
import OpenMicophoneTipCpt from './openMicophoneTip/index.vue';
import SelectMediaModalCpt from './selectMediaModal/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const cacheStore = usePiniaCacheStore();
const { maxBitrate, maxFramerate, resolutionRatio, allMediaTypeList } =
  useRTCParams();

const {
  confirmRoomName,
  startLive,
  endLive,
  sendDanmu,
  keydownDanmu,
  sendBlob,
  msgIsFile,
  mySocketId,
  lastCoverImg,
  canvasVideoStream,
  roomLiving,
  currentResolutionRatio,
  currentMaxBitrate,
  currentMaxFramerate,
  danmuStr,
  roomName,
  damuList,
  liveUserList,
} = usePush();

const currentMediaType = ref(MediaTypeEnum.camera);
const currentMediaData = ref<AppRootState['allTrack'][0]>();
const showOpenMicophoneTipCpt = ref(false);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const showNoLiveTipModalCpt = ref(false);
const isEdit = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const webaudioVideo = ref<HTMLVideoElement>();
const fabricCanvas = ref<fabric.Canvas>();
const startTime = ref(+new Date());
// const startTime = ref(1692807352565); // 1693027352565
const msgLoading = ref(false);
const uploadRef = ref<HTMLInputElement>();
const nullAudioStream = ref<MediaStream>();

const timeCanvasDom = ref<Raw<fabric.Text>[]>([]);
const stopwatchCanvasDom = ref<Raw<fabric.Text>[]>([]);
const wrapSize = reactive({
  width: 0,
  height: 0,
});
const workerTimerId = ref(-1);
const bodyAppendChildElArr = ref<HTMLElement[]>([]);
const liveType = Number(route.query.liveType);
const recorder = ref<MediaRecorder>();
const sendBlobTimer = ref();
const bolbId = ref(0);
const msrDelay = ref(1000 * 2);

watch(
  () => roomLiving.value,
  () => {
    if (!roomLiving.value) {
      handleEndLive();
      showNoLiveTipModalCpt.value = true;
    }
  }
);

watch(
  () => currentMaxBitrate.value,
  () => {
    if (liveType === LiveRoomTypeEnum.user_msr) {
      const stream = pushCanvasRef.value!.captureStream();
      const audioTrack = webaudioVideo
        // @ts-ignore
        .value!.captureStream()
        .getAudioTracks()[0];
      stream.addTrack(audioTrack);
      handleMsr(stream);
    }
  }
);
watch(
  () => currentMaxFramerate.value,
  () => {
    workerTimers.clearInterval(workerTimerId.value);
    renderFrame();
  }
);

watch(
  () => appStore.pkStream,
  (newval) => {
    console.log('pkStream', newval);
    if (newval) {
      addMediaOk({
        id: getRandomEnglishString(8),
        audio: 2,
        video: 1,
        mediaName: 'pkStream',
        type: MediaTypeEnum.pk,
        track: newval.getVideoTracks()[0],
        trackid: newval.getVideoTracks()[0].id,
        stream: newval,
        streamid: newval.id,
        hidden: false,
        muted: false,
        scaleInfo: {},
      });
    }
  }
);

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      handleScrollTop();
    }, 0);
  }
);

function handleScrollTop() {
  if (danmuListRef.value) {
    danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight + 10000;
  }
}

function handleSendBlob(event: BlobEvent) {
  bolbId.value += 1;
  console.log(event.data);
  sendBlob({
    blob: event.data,
    blobId: `${bolbId.value}`,
    delay: msrDelay.value,
  });
}

function mockClick() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  uploadRef.value?.click();
}

function handleWait() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  window.$message.warning('敬请期待！');
}

async function uploadChange() {
  const fileList = uploadRef.value?.files;
  if (fileList?.length) {
    try {
      msgLoading.value = true;
      msgIsFile.value = true;
      const res = await useUpload({
        prefix: QINIU_LIVE.prefix['billd-live/msg-image/'],
        file: fileList[0],
      });
      if (res?.resultUrl) {
        danmuStr.value = res.resultUrl || '错误图片';
        sendDanmu();
      }
    } catch (error) {
      console.log(error);
    } finally {
      msgIsFile.value = false;
      msgLoading.value = false;
      if (uploadRef.value) {
        uploadRef.value.value = '';
      }
    }
  }
}

function handleAllType() {
  const types = [
    'video/webm',
    'audio/webm',
    'video/mpeg',
    'video/webm;codecs=vp8',
    'video/webm;codecs=vp9',
    'video/webm;codecs=daala',
    'video/webm;codecs=h264',
    'audio/webm;codecs=opus',
    'audio/webm;codecs=aac',
    'audio/webm;codecs=h264,opus',
    'video/webm;codecs=avc1.64001f,opus',
    'video/webm;codecs=avc1.4d002a,opus',
  ];
  Object.keys(types).forEach((item) => {
    console.log(types[item], MediaRecorder.isTypeSupported(types[item]));
  });
}

function handleMsr(stream: MediaStream) {
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
  const mimeType = 'video/webm;codecs=avc1.4d002a,opus';
  // const mimeType = 'video/webm;codecs=avc1.64001f,opus'; // b站的参数

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.error('不支持', mimeType);
    return;
  } else {
    console.log('支持', mimeType);
  }
  /**
   * 小写的 "kb/s" 表示千比特每秒，而大写的 "KB/s" 表示千字节每秒
   * 例如，当我们说 100 kb/s 时，意思是每秒传输100千比特（比特）的数据。而当我们说 100 KB/s 时，意思是每秒传输100千字节（字节）的数据，相当于800千比特（比特）
   * 千字节（KB）、兆字节（MB）、千兆字节（GB）
   * 8 比特（bits）等于 1 字节（byte）
   * 1 Kbps（千比特每秒）等于 0.125 KB/s（千字节每秒）
   * 1 Mbps（兆比特每秒）等于 0.125 MB/s（兆字节每秒）
   * bit，比特
   * byte，字节
   * videoBitsPerSecond的单位是比特，假设videoBitsPerSecond值是1000*2000，即2000000
   * 2000000比特等于2000000 / 8 / 1000 = 250 KB/s
   */

  recorder.value = new MediaRecorder(stream, {
    mimeType,
    // bitsPerSecond: 1000 * currentMaxBitrate.value,
    videoBitsPerSecond: 1000 * currentMaxBitrate.value, // 单位是比特
    // audioBitsPerSecond: 1000 * 2000,
  });
  recorder.value.ondataavailable = handleSendBlob;
  sendBlobTimer.value = setInterval(function () {
    recorder.value?.stop();
    recorder.value?.start();
  }, msrDelay.value);
}

onMounted(() => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  initUserMedia();
  initCanvas();
  handleCache();
});

onUnmounted(() => {
  recorder.value?.stop();
  bodyAppendChildElArr.value.forEach((el) => {
    el.remove();
  });
  clearFrame();
});

async function initUserMedia() {
  const res1 = await handleUserMedia({ video: true, audio: false });
  console.log('初始化获取摄像头成功');
  const res2 = await handleUserMedia({ video: false, audio: true });
  console.log('初始化获取麦克风成功');
  if (!res1 || !res2) {
    showOpenMicophoneTipCpt.value = true;
  }
}

function renderAll() {
  timeCanvasDom.value.forEach((item) => {
    item.text = new Date().toLocaleString();
  });
  stopwatchCanvasDom.value.forEach((item) => {
    item.text = formatDownTime({
      endTime: +new Date(),
      startTime: startTime.value,
      showMs: true,
    });
  });
  fabricCanvas.value?.renderAll();
}

function clearFrame() {
  if (workerTimerId.value !== -1) {
    workerTimers.clearInterval(workerTimerId.value);
  }
}

function renderFrame() {
  // currentMaxFramerate等于20，实际fps是17.68
  const delay = 1000 / (currentMaxFramerate.value / (17.68 / 20)); // 60帧的话即16.666666666666668
  workerTimerId.value = workerTimers.setInterval(() => {
    renderAll();
  }, delay);
}

function handleNullAudio() {
  // 创建AudioContext对象
  const audioContext = new window.AudioContext();

  // 创建输入和输出节点
  const source = audioContext.createBufferSource();
  const destination = audioContext.createMediaStreamDestination();

  // 连接输入和输出节点
  source.connect(destination);

  // 播放空白音频
  source.start();

  // 获取音频流
  const stream = destination.stream;

  // 检查是否已经获取到音频流
  if (stream) {
    console.log('已创建空的直播音频流');
    const video = createVideo({
      appendChild: true,
    });
    video.srcObject = stream;
    nullAudioStream.value = stream;
  } else {
    console.error('无法创建空的直播音频流');
  }
}

function handleMixedAudio() {
  const allAudioTrack = appStore.allTrack.filter((item) => item.audio === 1);
  const nullAudio = nullAudioStream.value?.getAudioTracks()[0];
  if (nullAudio) {
    allAudioTrack.push({
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: '占位空音频',
      type: MediaTypeEnum.webAudio,
      track: nullAudio,
      trackid: nullAudio.id,
      stream: nullAudioStream.value,
      streamid: nullAudioStream.value?.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    });
  }
  const audioCtx = new AudioContext();
  if (canvasVideoStream.value?.getAudioTracks()[0]) {
    canvasVideoStream.value.removeTrack(
      canvasVideoStream.value.getAudioTracks()[0]
    );
  }
  const res: { source: MediaStreamAudioSourceNode; gainNode: GainNode }[] = [];
  allAudioTrack.forEach((item) => {
    if (!audioCtx || !item.stream) return;
    const source = audioCtx.createMediaStreamSource(item.stream);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = (item.volume || 100) / 100;
    source.connect(gainNode);
    res.push({ source, gainNode });
    console.log('混流', item.stream?.id, item.stream);
  });
  const destination = audioCtx.createMediaStreamDestination();
  res.forEach((item) => {
    item.source.connect(item.gainNode);
    item.gainNode.connect(destination);
  });
  if (webaudioVideo.value) {
    webaudioVideo.value.remove();
  }
  webaudioVideo.value = createVideo({
    appendChild: true,
  });
  bodyAppendChildElArr.value.push(webaudioVideo.value);
  webaudioVideo.value.className = 'web-audio-video';
  webaudioVideo.value!.srcObject = destination.stream;
  const resAudio = destination.stream.getAudioTracks()[0];
  canvasVideoStream.value?.addTrack(resAudio);
  networkStore.rtcMap.forEach((rtc) => {
    const sender = rtc.peerConnection
      ?.getSenders()
      .find((sender) => sender.track?.id === resAudio.id);
    if (!sender) {
      rtc.peerConnection
        ?.getSenders()
        ?.find((sender) => sender.track?.kind === 'audio')
        ?.replaceTrack(resAudio);
    }
  });
}

function handleEndLive() {
  clearInterval(sendBlobTimer.value);
  recorder.value?.removeEventListener('dataavailable', handleSendBlob);
  endLive();
}

function handleStartLive() {
  if (!appStore.allTrack.length) {
    window.$message.warning('至少选择一个素材');
    return;
  }
  handleNullAudio();
  handleMixedAudio();
  lastCoverImg.value = generateBase64(pushCanvasRef.value!);
  startLive({
    type: liveType,
    msrDelay: msrDelay.value,
  });
  if (liveType === LiveRoomTypeEnum.user_msr) {
    const stream = pushCanvasRef.value!.captureStream();
    // @ts-ignore
    const audioTrack = webaudioVideo.value!.captureStream().getAudioTracks()[0];
    stream.addTrack(audioTrack);
    handleMsr(stream);
  }
}

function handleScale({ width, height }: { width: number; height: number }) {
  const resolutionHeight = currentResolutionRatio.value;
  const resolutionWidth = currentResolutionRatio.value * appStore.videoRatio;
  let ratio = 1;
  if (width > resolutionWidth) {
    const r1 = resolutionWidth / width;
    ratio = r1;
  }
  if (height > resolutionHeight) {
    const r1 = resolutionHeight / height;
    if (ratio > r1) {
      ratio = r1;
    }
  }
  return ratio;
}

function autoCreateVideo({
  stream,
  id,
  rect,
  muted,
}: {
  stream: MediaStream;
  id: string;
  rect?: { left: number; top: number };
  muted?: boolean;
}) {
  const videoEl = createVideo({ appendChild: true });
  bodyAppendChildElArr.value.push(videoEl);
  videoEl.setAttribute('videoid', id);
  if (muted !== undefined) {
    videoEl.muted = muted;
  }
  videoEl.srcObject = stream;
  return new Promise<{
    canvasDom: fabric.Image;
    videoEl: HTMLVideoElement;
    scale: number;
  }>((resolve) => {
    videoEl.onloadedmetadata = () => {
      const width = stream.getVideoTracks()[0].getSettings().width!;
      const height = stream.getVideoTracks()[0].getSettings().height!;
      const ratio = handleScale({ width, height });
      videoEl.width = width;
      videoEl.height = height;

      const canvasDom = markRaw(
        new fabric.Image(videoEl, {
          top: rect?.top || 0,
          left: rect?.left || 0,
          width,
          height,
        })
      );
      console.log(
        '初始化',
        ratio,
        canvasDom.width,
        canvasDom.height,
        width * ratio,
        height * ratio,
        canvasDom
      );
      handleMoving({ canvasDom, id });
      handleScaling({ canvasDom, id });
      canvasDom.scale(ratio / window.devicePixelRatio);
      fabricCanvas.value!.add(canvasDom);

      resolve({ canvasDom, scale: ratio, videoEl });
    };
  });
}

watch(
  () => currentResolutionRatio.value,
  (newHeight, oldHeight) => {
    changeCanvasAttr({ newHeight, oldHeight });
  }
);

// 容器宽高，1280*720，即720p
// canvas容器宽高，2560*1440，即1440p

// ======
// 容器宽高，960*540，即540p
// dom宽高，640*480
// canvas容器宽高，960*540，即540p
// 将dom绘制到容器里，此时dom的大小就是640*480
// 需求，不管切换多少分辨率，我要看到的dom都是一样大小，即
// 960*540时，dom是640*480
// 1280*720时，dom不能是640*480了，因为这样他就会对比上一个分辨率的dom看起来小了，960/1280=0.75,540/720=0.75，
// 其实就是分辨率变大了，我们就要将图片也变大，即图片的宽是640/0.75=853.4，高是480/0.75=640
// 坐标变化，960*540时，dom坐标是100,100
// 1280*720时，dom的坐标不能再是100，100了，否则对比上一个分辨率看起来偏

function changeCanvasAttr({
  newHeight,
  oldHeight,
}: {
  newHeight: number;
  oldHeight: number;
}) {
  if (fabricCanvas.value) {
    const resolutionHeight =
      currentResolutionRatio.value / window.devicePixelRatio;
    const resolutionWidth =
      (currentResolutionRatio.value / window.devicePixelRatio) *
      appStore.videoRatio;
    fabricCanvas.value.setWidth(resolutionWidth);
    fabricCanvas.value.setHeight(resolutionHeight);
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        } else {
          // 分辨率变大了，将图片变大
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        }
      }
    });
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        } else {
          // 分辨率变大了，将图片变大
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        }
      }
    });

    changeCanvasStyle();
  }
}

function changeCanvasStyle() {
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.height = `${wrapSize.height}px`;
}

function initCanvas() {
  const resolutionHeight =
    currentResolutionRatio.value / window.devicePixelRatio;
  const resolutionWidth =
    (currentResolutionRatio.value / window.devicePixelRatio) *
    appStore.videoRatio;
  const wrapWidth = containerRef.value!.getBoundingClientRect().width;
  // const wrapWidth = 1920;
  const ratio = wrapWidth / resolutionWidth;
  const wrapHeight = resolutionHeight * ratio;
  // const wrapHeight = 1080;
  // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
  // upper-canvas: 操作时候的canvas
  const ins = markRaw(new fabric.Canvas(pushCanvasRef.value!));
  ins.setWidth(resolutionWidth);
  ins.setHeight(resolutionHeight);
  ins.setBackgroundColor('black', () => {
    console.log('setBackgroundColor回调');
  });
  wrapSize.width = wrapWidth;
  wrapSize.height = wrapHeight;
  fabricCanvas.value = ins;
  renderFrame();
  changeCanvasStyle();
}

/**
 * 1: {scaleX: 1, scaleY: 1}
 * 2: {scaleX: 0.5, scaleY: 0.5}
 * 3: {scaleX: 0.3333333333333333, scaleY: 0.3333333333333333}
 * 4: {scaleX: 0.25, scaleY: 0.25}
 */

/**
 * 二倍屏即1px里面有2个像素；三倍屏1px里面有3个像素，以此类推
 * 一个图片，宽高都是100px
 * 一倍屏展示：100px等于100个像素，一比一展示
 * 二倍屏展示：100px等于100个像素，二比一展示，即在二倍屏的100px看起来会比一倍屏的100px小一倍
 * 如果需要在一杯和二倍屏幕的时候看的大小都一样：
 * 1，在二倍屏的时候，需要将100px放大一倍，即200px；
 * 2，在一倍屏的时候，需要将100px缩小一百，即50px；
 */
function handleScaling({ canvasDom, id }) {
  canvasDom.on('scaling', () => {
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.scaleInfo[window.devicePixelRatio] = {
          scaleX: canvasDom.scaleX || 1,
          scaleY: canvasDom.scaleY || 1,
        };
        Object.keys(item.scaleInfo).forEach((iten) => {
          if (window.devicePixelRatio !== Number(iten)) {
            if (window.devicePixelRatio > Number(iten)) {
              item.scaleInfo[iten] = {
                scaleX:
                  item.scaleInfo[window.devicePixelRatio].scaleX *
                  window.devicePixelRatio,
                scaleY:
                  item.scaleInfo[window.devicePixelRatio].scaleY *
                  window.devicePixelRatio,
              };
            } else {
              if (window.devicePixelRatio === 1) {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX / Number(iten),
                  scaleY: item.scaleInfo[1].scaleY / Number(iten),
                };
              } else {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX * Number(iten),
                  scaleY: item.scaleInfo[1].scaleY * Number(iten),
                };
              }
            }
          }
        });
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
  });
}
function handleMoving({
  canvasDom,
  id,
}: {
  canvasDom: fabric.Image | fabric.Text;
  id: string;
}) {
  canvasDom.on('moving', () => {
    console.log(
      'moving',
      canvasDom.width,
      canvasDom.height,
      canvasDom.scaleX,
      canvasDom.scaleY
    );
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.rect = {
          top: (canvasDom.top || 0) * window.devicePixelRatio,
          left: (canvasDom.left || 0) * window.devicePixelRatio,
        };
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
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

async function handleDisplayMedia({ video, audio }) {
  try {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video,
      audio,
    });
    return event;
  } catch (error) {
    console.log(error);
  }
}

async function handleCache() {
  const res: AppRootState['allTrack'] = [];
  const err: string[] = [];
  const queue: any[] = [];
  cacheStore['resource-list'].forEach((item) => {
    // @ts-ignore
    const obj: AppRootState['allTrack'][0] = {};
    obj.audio = item.audio;
    obj.video = item.video;
    obj.id = item.id;
    obj.deviceId = item.deviceId;
    obj.type = item.type;
    obj.hidden = item.hidden;
    obj.mediaName = item.mediaName;
    obj.muted = item.muted;
    obj.volume = item.volume;
    obj.rect = item.rect;
    obj.scaleInfo = item.scaleInfo;
    obj.stopwatchInfo = item.stopwatchInfo;

    async function handleMediaVideo() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const url = URL.createObjectURL(file);
        const videoEl = createVideo({
          muted: item.muted ? item.muted : false,
          appendChild: true,
        });
        bodyAppendChildElArr.value.push(videoEl);
        videoEl.setAttribute('videoid', item.id);
        if (obj.volume !== undefined) {
          videoEl.volume = obj.volume / 100;
        }
        videoEl.src = url;
        await new Promise((resolve) => {
          videoEl.onloadedmetadata = () => {
            const stream = videoEl
              // @ts-ignore
              .captureStream();
            const width = stream.getVideoTracks()[0].getSettings().width!;
            const height = stream.getVideoTracks()[0].getSettings().height!;
            videoEl.width = width;
            videoEl.height = height;

            const canvasDom = markRaw(
              new fabric.Image(videoEl, {
                top: (item.rect?.top || 0) / window.devicePixelRatio,
                left: (item.rect?.left || 0) / window.devicePixelRatio,
                width,
                height,
              })
            );
            handleMoving({ canvasDom, id: item.id });
            handleScaling({ canvasDom, id: item.id });
            canvasDom.scale(
              item.scaleInfo[window.devicePixelRatio].scaleX || 1
            );
            fabricCanvas.value!.add(canvasDom);
            obj.videoEl = videoEl;
            obj.canvasDom = canvasDom;
            resolve({ videoEl, canvasDom });
          };
        });
        const stream = videoEl
          // @ts-ignore
          .captureStream() as MediaStream;
        obj.stream = stream;
        obj.streamid = stream.id;
        obj.track = stream.getVideoTracks()[0];
        obj.trackid = stream.getVideoTracks()[0].id;
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleImg() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const imgEl = await new Promise<HTMLImageElement>((resolve) => {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            function () {
              const img = document.createElement('img');
              img.src = reader.result as string;
              img.onload = () => {
                resolve(img);
              };
            },
            false
          );
          if (file) {
            reader.readAsDataURL(file);
          }
        });
        if (fabricCanvas.value) {
          const canvasDom = markRaw(
            new fabric.Image(imgEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width: imgEl.width,
              height: imgEl.height,
            })
          );
          handleMoving({ canvasDom, id: obj.id });
          handleScaling({ canvasDom, id: obj.id });
          canvasDom.scale(item.scaleInfo[window.devicePixelRatio].scaleX || 1);
          fabricCanvas.value.add(canvasDom);
          obj.canvasDom = canvasDom;
        }
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleScreen() {
      try {
        const event = await handleDisplayMedia({
          video: true,
          audio: true,
        });
        if (!event) return;
        const videoEl = createVideo({ appendChild: true });
        bodyAppendChildElArr.value.push(videoEl);
        videoEl.setAttribute('videoid', obj.id);
        videoEl.srcObject = event;
        await new Promise((resolve) => {
          videoEl.onloadedmetadata = () => {
            const stream = videoEl
              // @ts-ignore
              .captureStream();
            const width = stream.getVideoTracks()[0].getSettings().width!;
            const height = stream.getVideoTracks()[0].getSettings().height!;
            videoEl.width = width;
            videoEl.height = height;

            const canvasDom = markRaw(
              new fabric.Image(videoEl, {
                top: (item.rect?.top || 0) / window.devicePixelRatio,
                left: (item.rect?.left || 0) / window.devicePixelRatio,
                width,
                height,
              })
            );
            handleMoving({ canvasDom, id: item.id });
            handleScaling({ canvasDom, id: item.id });
            canvasDom.scale(
              item.scaleInfo[window.devicePixelRatio].scaleX || 1
            );
            fabricCanvas.value!.add(canvasDom);
            obj.videoEl = videoEl;
            obj.canvasDom = canvasDom;
            resolve({ videoEl, canvasDom });
          };
        });
      } catch (error) {
        console.error(error);
        handleDel(obj);
        err.push(obj.id);
      }
    }

    async function handleMicrophone() {
      const event = await handleUserMedia({
        video: false,
        audio: { deviceId: obj.deviceId },
      });
      if (!event) return;
      const videoEl = createVideo({ appendChild: true, muted: false });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      if (obj.volume !== undefined) {
        videoEl.volume = obj.muted ? 0 : obj.volume / 100;
      }
      obj.videoEl = videoEl;
      obj.stream = event;
      obj.streamid = event.id;
      obj.track = event.getAudioTracks()[0];
      obj.trackid = event.getAudioTracks()[0].id;
    }

    async function handleCamera() {
      const event = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: obj.deviceId },
        audio: false,
      });
      const videoEl = createVideo({ appendChild: true });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      await new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
          const stream = videoEl
            // @ts-ignore
            .captureStream();
          const width = stream.getVideoTracks()[0].getSettings().width!;
          const height = stream.getVideoTracks()[0].getSettings().height!;
          videoEl.width = width;
          videoEl.height = height;

          const canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
          handleMoving({ canvasDom, id: item.id });
          handleScaling({ canvasDom, id: item.id });
          canvasDom.scale(item.scaleInfo[window.devicePixelRatio].scaleX || 1);
          fabricCanvas.value!.add(canvasDom);
          obj.videoEl = videoEl;
          obj.canvasDom = canvasDom;
          resolve({ videoEl, canvasDom });
        };
      });
    }

    if (item.type === MediaTypeEnum.media && item.video === 1) {
      queue.push(handleMediaVideo());
    } else if (item.type === MediaTypeEnum.screen) {
      queue.push(handleScreen());
    } else if (item.type === MediaTypeEnum.camera) {
      queue.push(handleCamera());
    } else if (item.type === MediaTypeEnum.microphone) {
      queue.push(handleMicrophone());
    } else if (item.type === MediaTypeEnum.img) {
      queue.push(handleImg());
    } else if (item.type === MediaTypeEnum.txt) {
      obj.txtInfo = item.txtInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(item.txtInfo?.txt || '', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.txtInfo?.color,
          })
        );
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo[window.devicePixelRatio].scaleX);
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.time) {
      obj.timeInfo = item.timeInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(new Date().toLocaleString(), {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.timeInfo?.color,
          })
        );
        timeCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo[window.devicePixelRatio].scaleX);
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.stopwatch) {
      obj.stopwatchInfo = item.stopwatchInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text('00天00时00分00秒000毫秒', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.stopwatchInfo?.color,
          })
        );
        stopwatchCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo[window.devicePixelRatio].scaleX);
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    }
    res.push(obj);
  });
  await Promise.all(queue);
  canvasVideoStream.value = pushCanvasRef.value!.captureStream();
  appStore.setAllTrack(res.filter((v) => !err.includes(v.id)));
}

function handleShowMediaModalCpt(val: MediaTypeEnum) {
  isEdit.value = false;
  currentMediaData.value = undefined;
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

function handleEdit(item: AppRootState['allTrack'][0]) {
  currentMediaType.value = item.type;
  currentMediaData.value = item;
  isEdit.value = true;
  showMediaModalCpt.value = true;
}

function setScaleInfo({ track, canvasDom, scale = 1 }) {
  [1, 2, 3, 4].forEach((devicePixelRatio) => {
    track.scaleInfo[devicePixelRatio] = {
      scaleX: (1 / devicePixelRatio) * scale,
      scaleY: (1 / devicePixelRatio) * scale,
    };
  });
  if (window.devicePixelRatio !== 1) {
    const ratio = (1 / window.devicePixelRatio) * scale;
    canvasDom.scale(ratio);
    track.scaleInfo[window.devicePixelRatio] = {
      scaleX: ratio,
      scaleY: ratio,
    };
  }
}

async function addMediaOk(val: AppRootState['allTrack'][0]) {
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await handleDisplayMedia({
      video: {
        deviceId: val.deviceId,
        // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
      },
      audio: true,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.screen,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };

    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;

    const audio = event.getAudioTracks();
    if (audio.length) {
      videoTrack.audio = 1;
      videoTrack.volume = appStore.normalVolume;
      const audioTrack: AppRootState['allTrack'][0] = {
        id: videoTrack.id,
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.screen,
        track: event.getAudioTracks()[0],
        trackid: event.getAudioTracks()[0].id,
        stream: event,
        streamid: event.id,
        hidden: true,
        muted: false,
        volume: videoTrack.volume,
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, videoTrack, audioTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
      handleMixedAudio();
    } else {
      const res = [...appStore.allTrack, videoTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
    }
    console.log('获取窗口成功');
  } else if (val.type === MediaTypeEnum.camera) {
    const event = await handleUserMedia({
      video: {
        deviceId: val.deviceId,
      },
      audio: false,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.camera,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.pk) {
    const event = await handleUserMedia({
      video: {
        deviceId: val.deviceId,
      },
      audio: false,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.pk,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取pk成功');
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await handleUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    if (!event) return;
    const microphoneVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      deviceId: val.deviceId,
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      trackid: event.getAudioTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      volume: 60,
      scaleInfo: {},
    };
    const videoEl = createVideo({ appendChild: true, muted: false });
    bodyAppendChildElArr.value.push(videoEl);
    videoEl.setAttribute('videoid', microphoneVideoTrack.id);
    videoEl.srcObject = event;
    microphoneVideoTrack.videoEl = videoEl;
    const res = [...appStore.allTrack, microphoneVideoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    handleMixedAudio();
    console.log('获取麦克风成功');
  } else if (val.type === MediaTypeEnum.txt) {
    const txtTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.txt,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(val.txtInfo?.txt || '', {
          top: 0,
          left: 0,
          fill: val.txtInfo?.color,
        })
      );
      handleMoving({ canvasDom, id: txtTrack.id });
      handleScaling({ canvasDom, id: txtTrack.id });
      txtTrack.txtInfo = val.txtInfo;
      if (window.devicePixelRatio !== 1) {
        const ratio = 1 / window.devicePixelRatio;
        canvasDom.scale(ratio);
        txtTrack.scaleInfo[window.devicePixelRatio] = {
          scaleX: ratio,
          scaleY: ratio,
        };
      } else {
        txtTrack.scaleInfo[window.devicePixelRatio] = { scaleX: 1, scaleY: 1 };
      }
      txtTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, txtTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取文字成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.time) {
    const timeTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.time,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(new Date().toLocaleString(), {
          top: 0,
          left: 0,
          fill: val.timeInfo?.color,
        })
      );
      setScaleInfo({ canvasDom, track: timeTrack });
      timeCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: timeTrack.id });
      handleScaling({ canvasDom, id: timeTrack.id });
      timeTrack.timeInfo = val.timeInfo;
      timeTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, timeTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取时间成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.stopwatch) {
    const stopwatchTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.stopwatch,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text('00天00时00分00秒000毫秒', {
          top: 0,
          left: 0,
          fill: val.stopwatchInfo?.color,
          // editable: true,
        })
      );
      setScaleInfo({ canvasDom, track: stopwatchTrack });
      stopwatchCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: stopwatchTrack.id });
      handleScaling({ canvasDom, id: stopwatchTrack.id });
      stopwatchTrack.stopwatchInfo = val.stopwatchInfo;
      stopwatchTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, stopwatchTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取秒表成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.img) {
    const imgTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.img,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };

    if (fabricCanvas.value) {
      if (!val.imgInfo) return;
      const file = val.imgInfo[0].file!;
      const { code } = await saveFile({ file, fileName: imgTrack.id });
      if (code !== 1) return;
      const imgEl = await new Promise<HTMLImageElement>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          function () {
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.onload = () => {
              resolve(img);
            };
          },
          false
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      });

      const canvasDom = markRaw(
        new fabric.Image(imgEl, {
          top: 0,
          left: 0,
          width: imgEl.width,
          height: imgEl.height,
        })
      );
      const scale = handleScale({ width: imgEl.width, height: imgEl.height });
      setScaleInfo({ canvasDom, track: imgTrack, scale });
      handleMoving({ canvasDom, id: imgTrack.id });
      handleScaling({ canvasDom, id: imgTrack.id });
      imgTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, imgTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取图片成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.media) {
    const mediaVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.media,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      if (!val.mediaInfo) return;
      const file = val.mediaInfo[0].file!;
      const { code } = await saveFile({ file, fileName: mediaVideoTrack.id });
      if (code !== 1) return;
      const url = URL.createObjectURL(file);
      const videoEl = createVideo({ muted: false, appendChild: true });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.src = url;
      videoEl.muted = false;
      const videoRes = await new Promise<HTMLVideoElement>((resolve) => {
        videoEl.onloadedmetadata = () => {
          resolve(videoEl);
        };
      });
      // @ts-ignore
      const stream = videoRes.captureStream();
      const { canvasDom, scale } = await autoCreateVideo({
        stream,
        id: mediaVideoTrack.id,
      });
      setScaleInfo({ canvasDom, track: mediaVideoTrack, scale });
      mediaVideoTrack.videoEl = videoEl;
      mediaVideoTrack.canvasDom = canvasDom;
      if (stream.getAudioTracks()[0]) {
        console.log('视频有音频', stream.getAudioTracks()[0]);
        mediaVideoTrack.audio = 1;
        mediaVideoTrack.volume = appStore.normalVolume;
        const audioTrack: AppRootState['allTrack'][0] = {
          id: mediaVideoTrack.id,
          audio: 1,
          video: 2,
          mediaName: val.mediaName,
          type: MediaTypeEnum.media,
          track: stream.getAudioTracks()[0],
          trackid: stream.getAudioTracks()[0].id,
          stream,
          streamid: stream.id,
          hidden: true,
          muted: false,
          volume: mediaVideoTrack.volume,
          scaleInfo: {},
        };
        const res = [...appStore.allTrack, audioTrack];
        appStore.setAllTrack(res);
        cacheStore.setResourceList(res);
        handleMixedAudio();
      }
    }
    const res = [...appStore.allTrack, mediaVideoTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取视频成功', fabricCanvas.value);
  }
}

function editMediaOk(val: AppRootState['allTrack'][0]) {
  showMediaModalCpt.value = false;
  const res = appStore.allTrack.map((item) => {
    if (item.id === val.id) {
      item.mediaName = val.mediaName;
      item.timeInfo = val.timeInfo;
      item.stopwatchInfo = val.stopwatchInfo;
      item.txtInfo = val.txtInfo;
      if (
        [
          MediaTypeEnum.txt,
          MediaTypeEnum.time,
          MediaTypeEnum.stopwatch,
        ].includes(val.type)
      ) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set(
            'fill',
            val.txtInfo?.color ||
              val.timeInfo?.color ||
              val.stopwatchInfo?.color
          );
        }
      }
      if (val.type === MediaTypeEnum.txt) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set('text', val.txtInfo?.txt);
        }
      }
    }
    return item;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
}

function handleChangeMuted(item: AppRootState['allTrack'][0]) {
  if (item.videoEl) {
    const res = !item.videoEl.muted;
    item.videoEl.muted = res;
    item.videoEl.volume = res ? 0 : appStore.normalVolume / 100;
    item.volume = res ? 0 : appStore.normalVolume;
    item.muted = res;
    cacheStore.setResourceList(appStore.allTrack);
    handleMixedAudio();
  }
}

function handleChangeVolume(item: AppRootState['allTrack'][0], v) {
  const res = appStore.allTrack.map((iten) => {
    if (iten.id === item.id) {
      if (item.volume !== undefined) {
        iten.volume = v;
        iten.muted = v === 0;
        if (iten.videoEl) {
          iten.videoEl.volume = v / 100;
          iten.videoEl.muted = v === 0;
        }
      }
    }
    return iten;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleDel(item: AppRootState['allTrack'][0]) {
  if (item.canvasDom !== undefined) {
    fabricCanvas.value?.remove(item.canvasDom);
    item.videoEl?.remove();
    item.stream?.getTracks().forEach((track) => {
      track.stop();
      item.stream?.removeTrack(track);
    });
  }
  bodyAppendChildElArr.value.forEach((el) => {
    const videoid = el.getAttribute('videoid');
    if (item.id === videoid) {
      el.remove();
    }
  });
  const res = appStore.allTrack.filter((iten) => iten.id !== item.id);
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleStartMedia(item: { type: MediaTypeEnum; txt: string }) {
  currentMediaType.value = item.type;
  showMediaModalCpt.value = true;
}
</script>

<style lang="scss" scoped>
.slider {
  width: 80px;
}
.push-wrap {
  display: flex;
  justify-content: space-between;
  margin: 15px auto 0;
  width: $w-1250;
  .left {
    position: relative;
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: $w-960;
    height: 100%;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;
    vertical-align: top;

    .container {
      position: relative;
      overflow: hidden;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.5);
      line-height: 0;

      .add-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px 20px;
        width: 50%;
        border-radius: 6px;
        background-color: white;
        transform: translate(-50%, -50%);
      }
    }
    .room-control {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background-color: papayawhip;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 20px;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .detail {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          width: 200px;
          text-align: initial;
          .top {
            margin-bottom: 10px;
            color: #18191c;
          }
          .bottom {
            font-size: 14px;
          }
        }
      }
      .rtc {
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 14px;
        .item {
          display: flex;
          align-items: center;
          flex: 1;
          .txt {
            flex-shrink: 0;
            width: 80px;
          }
          .down {
            width: 90px;

            user-select: none;
          }
        }
      }
      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        .top {
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    margin-left: 10px;
    width: $w-250;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;

    .resource-card {
      position: relative;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
      height: 290px;
      border-radius: 6px;
      background-color: papayawhip;
      .title {
        text-align: initial;
      }
      .list {
        overflow: scroll;
        height: 218px;

        @extend %customScrollbar;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 14px;
          // &:hover {
          //   .control {
          //     display: flex;
          //     align-items: center;
          //   }
          // }
          .control {
            display: flex;
            align-items: center;
            .control-item {
              cursor: pointer;
              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px;
      }
    }
    .danmu-card {
      position: relative;
      flex: 1;
      box-sizing: border-box;
      padding: 10px 10px 0px;
      width: 100%;
      border-radius: 6px;
      background-color: papayawhip;
      text-align: initial;
      .title {
        margin-bottom: 10px;
      }
      .list {
        overflow: scroll;
        height: 266px;

        @extend %customScrollbar;

        .item {
          box-sizing: border-box;
          margin-bottom: 4px;
          padding: 2px 0;
          white-space: normal;
          word-wrap: break-word;
          font-size: 13px;

          .name {
            color: #9499a0;
            cursor: pointer;
            &.system {
              color: red;
            }
          }
          .msg {
            margin-top: 4px;
            color: #61666d;
            &.img {
              img {
                width: 80%;
              }
            }
          }
        }
      }
      .send-msg {
        position: relative;
        box-sizing: border-box;
        padding: 4px 0;
        width: 100%;
        .control {
          display: flex;
          margin: 4px 0;
          .ico {
            margin-right: 6px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            .input-upload {
              width: 0;
              height: 0;
              opacity: 0;
            }
            &.face {
              @include setBackground('@/assets/img/msg-face.webp');
            }
            &.img {
              @include setBackground('@/assets/img/msg-img.webp');
            }
          }
        }
        .ipt {
          display: block;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 10px;
          width: 100%;
          height: 60px;
          outline: none;
          border: 1px solid hsla(0, 0%, 60%, 0.2);
          border-radius: 4px;
          background-color: #f1f2f3;
          font-size: 14px;
        }
        .btn {
          box-sizing: border-box;
          margin-top: 10px;
          margin-left: auto;
          padding: 4px;
          width: 70px;
          border-radius: 4px;
          background-color: $theme-color-gold;
          color: white;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
        }
      }

      // .send-msg {
      //   display: flex;
      //   align-items: center;
      //   box-sizing: border-box;
      //   width: calc(100% - 20px);
      //   .ipt {
      //     display: block;
      //     box-sizing: border-box;
      //     margin: 0 auto;
      //     margin-right: 10px;
      //     padding: 10px;
      //     width: 80%;
      //     height: 30px;
      //     outline: none;
      //     border: 1px solid hsla(0, 0%, 60%, 0.2);
      //     border-radius: 4px;
      //     background-color: #f1f2f3;
      //     font-size: 14px;
      //   }
      // }
    }
  }
}

// 屏幕宽度大于1500的时候
@media screen and (min-width: $w-1500) {
  .push-wrap {
    width: $w-1475;
    .left {
      width: $w-1150;
    }
    .right {
      width: $w-300;
    }
  }
}
</style>
