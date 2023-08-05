<template>
  <div class="push-wrap">
    <input
      type="file"
      @change="ddddd"
    />
    <div @click="aaaa">读取</div>
    <div
      ref="topRef"
      class="left"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <AudioRoomTip></AudioRoomTip>
        <canvas
          id="pushCanvasRef"
          ref="pushCanvasRef"
        ></canvas>
        <div
          v-if="
            appCacheStore.allTrack.filter((item) => !item.hidden).length <= 0
          "
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
                {{ getSocketId() }}
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
                  liveUserList.filter((item) => item.id !== getSocketId())
                    .length
                }}
              </span>
            </span>
          </div>
          <div class="bottom">
            <n-button
              v-if="!isLiving"
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
              @click="endLive"
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
            v-for="(item, index) in appCacheStore.allTrack.filter(
              (item) => !item.hidden
            )"
            :key="index"
            class="item"
          >
            <span class="name">
              ({{ mediaTypeEnumMap[item.type] }}-{{
                item.audio === 1 ? '音频' : '视频'
              }}){{ item.mediaName }}
            </span>
            <div class="control">
              <div class="control-item">
                <n-icon
                  size="16"
                  @click="handleChangeMuted(item)"
                >
                  <VolumeMuteOutline v-if="item.muted"></VolumeMuteOutline>
                  <VolumeHighOutline v-else></VolumeHighOutline>
                </n-icon>
              </div>
              <div class="control-item">
                <n-icon
                  size="16"
                  @click="handleDelTrack(item)"
                >
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
                  {{ item.userInfo?.username || item.socket_id }}：
                </span>
                <span class="msg">{{ item.msg }}</span>
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
        <div class="send-msg">
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
        </div>
      </div>
    </div>

    <SelectMediaModalCpt
      v-if="showSelectMediaModalCpt"
      :all-media-type-list="allMediaTypeList"
      @close="showSelectMediaModalCpt = false"
      @ok="selectMediaOk"
    ></SelectMediaModalCpt>

    <MediaModalCpt
      v-if="showMediaModalCpt"
      :media-type="currentMediaType"
      @close="showMediaModalCpt = false"
      @ok="addMediaOk"
    ></MediaModalCpt>
    <OpenMicophoneTipCpt
      v-if="showOpenMicophoneTipCpt"
      @close="showOpenMicophoneTipCpt = false"
    ></OpenMicophoneTipCpt>
  </div>
</template>

<script lang="ts" setup>
import { Close, VolumeHighOutline, VolumeMuteOutline } from '@vicons/ionicons5';
import { fabric } from 'fabric';
import { UploadFileInfo } from 'naive-ui';
import { NODE_ENV } from 'script/constant';
import { markRaw, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as workerTimers from 'worker-timers';

import { usePush } from '@/hooks/use-push';
import { DanmuMsgTypeEnum, MediaTypeEnum, liveTypeEnum } from '@/interface';
import { AppRootState } from '@/store/app';
import { useAppCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { createVideo, generateBase64, getRandomEnglishString } from '@/utils';

import MediaModalCpt from './mediaModal/index.vue';
import OpenMicophoneTipCpt from './openMicophoneTip/index.vue';
import SelectMediaModalCpt from './selectMediaModal/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appCacheStore = useAppCacheStore();
const currentMediaType = ref(MediaTypeEnum.camera);
const showOpenMicophoneTipCpt = ref(false);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const fabricCanvas = ref<fabric.Canvas>();
const localVideoRef = ref<HTMLVideoElement>();
const audioCtx = ref<AudioContext>();
const remoteVideoRef = ref<HTMLVideoElement[]>([]);
const isSRS = route.query.liveType === liveTypeEnum.srsPush;
const wrapSize = reactive({
  width: 0,
  height: 0,
});

const scaleRatio = ref(0);
const timerId = ref(-1);
const videoRatio = ref(16 / 9);
const {
  confirmRoomName,
  getSocketId,
  startLive,
  endLive,
  sendDanmu,
  keydownDanmu,
  lastCoverImg,
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
} = usePush({
  localVideoRef,
  remoteVideoRef,
  isSRS,
});

const mediaTypeEnumMap = {
  [MediaTypeEnum.camera]: '摄像头',
  [MediaTypeEnum.microphone]: '麦克风',
  [MediaTypeEnum.screen]: '窗口',
  [MediaTypeEnum.img]: '图片',
  [MediaTypeEnum.txt]: '文字',
  [MediaTypeEnum.media]: '视频',
};

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      if (danmuListRef.value) {
        danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight;
      }
    }, 0);
  }
);

// 处理页面显示/隐藏
function onPageVisibility() {
  // 注意：此属性在Page Visibility Level 2 规范中被描述为“历史” 。考虑改用该Document.visibilityState 属性。
  // const isHidden = document.hidden;

  if (document.visibilityState === 'hidden') {
    console.log(new Date().toLocaleString(), '页面隐藏了', timerId.value);
    if (isLiving.value) {
      const delay = 1000 / 60; // 16.666666666666668
      timerId.value = workerTimers.setInterval(() => {
        fabricCanvas.value?.renderAll();
      }, delay);
    }
  } else {
    console.log(new Date().toLocaleString(), '页面显示了', timerId.value);
    if (isLiving.value) {
      workerTimers.clearInterval(timerId.value);
    }
  }
}

function initUserMedia() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(() => {
      console.log('初始化获取摄像头成功');
    })
    .catch(() => {
      console.log('初始化获取摄像头失败');
    })
    .finally(() => {
      navigator.mediaDevices
        .getUserMedia({
          video: false,
          audio: true,
        })
        .then(() => {
          console.log('初始化获取麦克风成功');
        })
        .catch(() => {
          console.log('初始化获取麦克风失败');
          showOpenMicophoneTipCpt.value = true;
        });
    });
}

// 处理空音频轨
function initNullAudio() {
  // 创建一个AudioContext实例
  const audioContext = new window.AudioContext();

  // 创建一个GainNode实例来控制音频的音量
  const gainNode = audioContext.createGain();

  // 创建一个空的音频缓存
  const buffer = audioContext.createBuffer(
    2,
    audioContext.sampleRate * 3,
    audioContext.sampleRate
  );

  // 创建一个用于播放音频的AudioBufferSourceNode
  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  // 将源连接到gain node，再连接到输出
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  const destination = audioContext.createMediaStreamDestination();

  const audioTrack = {
    id: getRandomEnglishString(8),
    audio: 1,
    video: 2,
    mediaName: '',
    type: MediaTypeEnum.webAudio,
    track: destination.stream.getAudioTracks()[0],
    trackid: destination.stream.getAudioTracks()[0].id,
    stream: destination.stream,
    streamid: destination.stream.id,
    hidden: true,
  };
  appCacheStore.setAllTrack([...appCacheStore.allTrack, audioTrack]);
  // const vel = createVideo({});
  // vel.srcObject = destination.stream;
  // document.body.appendChild(vel);
}
let streamTmp: MediaStream;
let vel;

function handleMixedAudio() {
  const allAudioTrack = appCacheStore.allTrack.filter(
    (item) => item.audio === 1
  );
  if (allAudioTrack.length && audioCtx.value) {
    const gainNode = audioCtx.value.createGain();
    allAudioTrack.forEach((item) => {
      if (!audioCtx.value) return;
      const audioInput = audioCtx.value.createMediaStreamSource(item.stream!);
      audioInput.connect(gainNode);
      console.log('混流', item.stream?.id, item.stream);
    });
    if (streamTmp) {
      const destination = audioCtx.value.createMediaStreamDestination();
      streamTmp.addTrack(destination.stream.getAudioTracks()[0]);
      gainNode.connect(destination);
      const mixedStream = new MediaStream();
      mixedStream.addTrack(destination.stream.getAudioTracks()[0]);
      mixedStream.addTrack(canvasVideoStream.value!.getVideoTracks()[0]);
      canvasVideoStream.value = mixedStream;
      console.log('替换了');
      return;
    }
    const destination = audioCtx.value.createMediaStreamDestination();
    streamTmp = destination.stream;
    // @ts-ignore
    canvasVideoStream.value?.addTrack(destination.stream.getAudioTracks()[0]);
    gainNode.connect(destination);
    vel = createVideo({});
    vel.srcObject = destination.stream;
    document.body.appendChild(vel);
  }
}

function handleStartLive() {
  lastCoverImg.value = generateBase64(pushCanvasRef.value!);

  const allAudioTrack = appCacheStore.allTrack.filter(
    (item) => item.audio === 1
  );
  if (allAudioTrack.length) {
    audioCtx.value = new AudioContext();
    handleMixedAudio();
  }
  startLive();
}

function handleScale({ width, height }: { width: number; height: number }) {
  const resolutionHeight =
    currentResolutionRatio.value / window.devicePixelRatio;
  const resolutionWidth =
    (currentResolutionRatio.value / window.devicePixelRatio) * videoRatio.value;
  console.log('当前分辨率', { resolutionWidth, resolutionHeight });
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
  // if (width > wrapSize.width) {
  //   const r1 = wrapSize.width / width;
  //   ratio = r1;
  // }
  // if (height > wrapSize.height) {
  //   const r1 = wrapSize.height / height;
  //   if (ratio > r1) {
  //     ratio = r1;
  //   }
  // }

  return ratio;
}

function autoCreateVideo({ stream }: { stream: MediaStream }) {
  const video = createVideo({});
  video.srcObject = stream;
  video.style.width = `1px`;
  video.style.height = `1px`;
  video.style.position = 'fixed';
  video.style.bottom = '0';
  video.style.right = '0';
  video.style.opacity = '0';
  video.style.pointerEvents = 'none';
  document.body.appendChild(video);
  return new Promise<{ canvasDom: fabric.Image; initScale: number }>(
    (resolve) => {
      video.onloadedmetadata = () => {
        const width = stream.getVideoTracks()[0].getSettings().width!;
        const height = stream.getVideoTracks()[0].getSettings().height!;
        const ratio = handleScale({ width, height });
        const initScale = 1;
        video.width = width;
        video.height = height;

        const canvasDom = markRaw(
          new fabric.Image(video, {
            top: 0,
            left: 0,
            width,
            height,
          })
        );
        console.log(
          '初始化',
          ratio,
          canvasDom.width,
          canvasDom.height,
          canvasDom
        );

        canvasDom.scale(ratio);
        fabricCanvas.value!.add(canvasDom);
        function renderFrame() {
          fabricCanvas.value?.renderAll();
          window.requestAnimationFrame(renderFrame);
        }

        renderFrame();

        resolve({ canvasDom, initScale });
      };
    }
  );
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
      videoRatio.value;
    fabricCanvas.value.setWidth(resolutionWidth);
    fabricCanvas.value.setHeight(resolutionHeight);
    // fabricCanvas.value.forEachObject((canvas) => {
    //   canvas.setCoords();
    // });
    appCacheStore.allTrack.forEach((item) => {
      if (item.canvasDom) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.canvasDom.scaleX || 1) * ratio;
          const ratio2 = oldHeight / newHeight;
          console.log(
            ratio,
            ratio1,
            '分辨率变小了，将图片变小-----',
            item.canvasDom
          );
          item.canvasDom.scale(ratio1);
          item.canvasDom.left = item.canvasDom.left! / ratio2;
          item.canvasDom.top = item.canvasDom.top! / ratio2;
        } else {
          // 分辨率变大了，将图片变大
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.canvasDom.scaleX || 1) * ratio;
          const ratio2 = oldHeight / newHeight;
          console.log(
            ratio,
            ratio1,
            '分辨率变大了，将图片变大-----',
            item.canvasDom
          );
          item.canvasDom.scale(ratio1);
          item.canvasDom.left = item.canvasDom.left! / ratio2;
          item.canvasDom.top = item.canvasDom.top! / ratio2;
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
    (currentResolutionRatio.value / window.devicePixelRatio) * videoRatio.value;
  const wrapWidth = containerRef.value!.getBoundingClientRect().width;
  // const wrapWidth = 1920;
  const ratio = wrapWidth / resolutionWidth;
  scaleRatio.value = resolutionWidth / wrapWidth;
  const wrapHeight = resolutionHeight * ratio;
  // const wrapHeight = 1080;
  // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
  // upper-canvas: 操作时候的canvas
  const ins = markRaw(new fabric.Canvas(pushCanvasRef.value!));
  console.log('window.devicePixelRatio', window.devicePixelRatio);
  ins.setWidth(resolutionWidth);
  ins.setHeight(resolutionHeight);
  ins.setBackgroundColor('black', () => {});
  wrapSize.width = wrapWidth;
  wrapSize.height = wrapHeight;
  fabricCanvas.value = ins;
  changeCanvasStyle();
}

onMounted(() => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  initNullAudio();
  initUserMedia();
  initCanvas();
  document.addEventListener('visibilitychange', onPageVisibility);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onPageVisibility);
});

function selectMediaOk(val: MediaTypeEnum) {
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

async function addMediaOk(val: {
  type: MediaTypeEnum;
  deviceId: string;
  mediaName: string;
  txtInfo?: { txt: string; color: string };
  imgInfo?: UploadFileInfo[];
  mediaInfo?: UploadFileInfo[];
}) {
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video: {
        deviceId: val.deviceId,
        // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
      },
      audio: true,
    });

    const videoTrack = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.screen,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
    };

    const { canvasDom, initScale } = await autoCreateVideo({
      stream: event,
    });
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;
    // @ts-ignore
    videoTrack.initScale = initScale;

    const audio = event.getAudioTracks();
    if (audio.length) {
      const audioTrack = {
        id: getRandomEnglishString(8),
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.screen,
        track: event.getAudioTracks()[0],
        trackid: event.getAudioTracks()[0].id,
        stream: event,
        streamid: event.id,
      };
      appCacheStore.setAllTrack([
        ...appCacheStore.allTrack,
        videoTrack,
        audioTrack,
      ]);
      handleMixedAudio();
      addTrack(videoTrack);
      addTrack(audioTrack);
    } else {
      appCacheStore.setAllTrack([...appCacheStore.allTrack, videoTrack]);
      addTrack(videoTrack);
    }

    console.log('获取窗口成功');
  } else if (val.type === MediaTypeEnum.camera) {
    const event = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: val.deviceId,
      },
      audio: false,
    });
    const videoTrack = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.camera,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
    };
    const { canvasDom, initScale } = await autoCreateVideo({
      stream: event,
    });
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;
    // @ts-ignore
    videoTrack.initScale = initScale;

    appCacheStore.setAllTrack([...appCacheStore.allTrack, videoTrack]);
    addTrack(videoTrack);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    const audioTrack = {
      id: getRandomEnglishString(8),
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      trackid: event.getAudioTracks()[0].id,
      stream: event,
      streamid: event.id,
    };
    appCacheStore.setAllTrack([...appCacheStore.allTrack, audioTrack]);
    handleMixedAudio();
    addTrack(audioTrack);

    console.log('获取麦克风成功');
  } else if (val.type === MediaTypeEnum.txt) {
    const txtTrack = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.txt,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
    };
    if (fabricCanvas.value) {
      const dom = markRaw(
        new fabric.Text(val.txtInfo?.txt || '', {
          top: 0,
          left: 0,
          fill: val.txtInfo?.color,
        })
      );
      // @ts-ignore
      txtTrack.canvasDom = dom;
      fabricCanvas.value.add(dom);
    }

    // @ts-ignore
    appCacheStore.setAllTrack([...appCacheStore.allTrack, txtTrack]);
    addTrack(txtTrack);

    console.log('获取文字成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.img) {
    const imgTrack = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.img,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
    };

    if (fabricCanvas.value) {
      const imgEl = await new Promise<HTMLImageElement>((resolve) => {
        if (!val.imgInfo) return;
        const file = val.imgInfo[0].file;
        console.log(file);
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
      const ratio = handleScale({ width: imgEl.width, height: imgEl.height });
      console.log(
        '初始化',
        ratio,
        canvasDom.width,
        canvasDom.height,
        canvasDom
      );
      // @ts-ignore
      imgTrack.canvasDom = canvasDom;
      canvasDom.scale(ratio);
      fabricCanvas.value.add(canvasDom);
    }

    // @ts-ignore
    appCacheStore.setAllTrack([...appCacheStore.allTrack, imgTrack]);
    addTrack(imgTrack);

    console.log('获取图片成功', fabricCanvas.value);
  } else if (val.type === MediaTypeEnum.media) {
    const mediaVideoTrack = {
      id: getRandomEnglishString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.media,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
    };
    if (fabricCanvas.value) {
      if (!val.mediaInfo) return;
      const file = val.mediaInfo[0].file!;
      console.log(file);
      console.log(file.name);
      const url = URL.createObjectURL(file);
      console.log(url);
      const videoEl = createVideo({});
      videoEl.src = url;
      videoEl.muted = false;
      videoEl.style.width = `1px`;
      videoEl.style.height = `1px`;
      videoEl.style.position = 'fixed';
      videoEl.style.bottom = '0';
      videoEl.style.right = '0';
      videoEl.style.opacity = '0';
      videoEl.style.pointerEvents = 'none';
      document.body.appendChild(videoEl);
      const videoRes = await new Promise<HTMLVideoElement>((resolve) => {
        videoEl.onloadedmetadata = () => {
          resolve(videoEl);
        };
      });
      // @ts-ignore
      const stream = videoRes.captureStream();
      const { canvasDom, initScale } = await autoCreateVideo({
        stream,
      });
      // @ts-ignore
      mediaVideoTrack.canvasDom = canvasDom;
      // @ts-ignore
      mediaVideoTrack.initScale = initScale;
      console.log('视频有音频', stream.getAudioTracks()[0]);
      if (stream.getAudioTracks()[0]) {
        const audioTrack = {
          id: getRandomEnglishString(8),
          audio: 1,
          video: 2,
          mediaName: val.mediaName,
          type: MediaTypeEnum.media,
          track: stream.getAudioTracks()[0],
          trackid: stream.getAudioTracks()[0].id,
          stream,
          streamid: stream.id,
        };
        // @ts-ignore
        appCacheStore.setAllTrack([...appCacheStore.allTrack, audioTrack]);
        handleMixedAudio();
        addTrack(audioTrack);
      }
    }
    // @ts-ignore
    appCacheStore.setAllTrack([...appCacheStore.allTrack, mediaVideoTrack]);
    addTrack(mediaVideoTrack);

    console.log('获取视频成功', fabricCanvas.value);
  }

  canvasVideoStream.value = pushCanvasRef.value!.captureStream();
}

function handleChangeMuted(item: AppRootState['allTrack'][0]) {}

function handleDelTrack(item: AppRootState['allTrack'][0]) {
  console.log('handleDelTrack', item);
  if (item.canvasDom !== undefined) {
    // @ts-ignore
    fabricCanvas.value?.remove(item.canvasDom);
  }
  const res = appCacheStore.allTrack.filter((iten) => iten.id !== item.id);
  appCacheStore.setAllTrack(res);
  delTrack(item);
}

function aaaa(e) {
  // @ts-ignore
  const requestFileSystem =
    // @ts-ignore
    window.requestFileSystem || window.webkitRequestFileSystem;
  // @ts-ignore
  const directoryEntry = window.directoryEntry || window.webkitDirectoryEntry;
  function onError(err) {
    console.log(err);
  }
  function onFs(fs) {
    fs.root.getFile(
      'myvideo',
      {},
      function (fileEntry) {
        fileEntry.file(function (file) {
          console.log(file, 777);
          const url = URL.createObjectURL(file);
          console.log(url);
          const videoEl = createVideo({});
          videoEl.src = url;
          // videoEl.muted = false;
          // videoEl.style.width = `1px`;
          // videoEl.style.height = `1px`;
          // videoEl.style.position = 'fixed';
          // videoEl.style.bottom = '0';
          // videoEl.style.right = '0';
          // videoEl.style.opacity = '0';
          // videoEl.style.pointerEvents = 'none';
          document.body.appendChild(videoEl);
        }, onError);
      },
      onError
    );
  }

  // Opening a file system with temporary storage
  requestFileSystem(
    // @ts-ignore
    window.PERSISTENT,
    1024 * 1024 * 1024 /* 1GB */,
    onFs,
    onError
  );
}
function ddddd(e) {
  const file = e.target.files[0] as File;
  // @ts-ignore
  const requestFileSystem =
    // @ts-ignore
    window.requestFileSystem || window.webkitRequestFileSystem;
  // @ts-ignore
  const directoryEntry = window.directoryEntry || window.webkitDirectoryEntry;
  function onError(err) {
    console.log(err);
  }
  function onFs(fs) {
    // 创建文件
    fs.root.getFile(
      'myvideo',
      { create: true },
      function (fileEntry) {
        // 创建文件写入流
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = () => {
            // 完成后关闭文件
            fileWriter.abort();
          };
          // 写入文件内容
          fileWriter.write(file);
          console.log('写入文件内容');
          // const content = new Blob([fileContent]);
          // fileWriter.write(content);
        });
      },
      () => {
        console.log('err');
      }
    );
    // fs.root.getDirectory(
    //   'Documents',
    //   { create: true },
    //   function (directoryEntry) {
    //     console.log(directoryEntry);
    //     // directoryEntry.isFile === false
    //     // directoryEntry.isDirectory === true
    //     // directoryEntry.name === 'Documents'
    //     // directoryEntry.fullPath === '/Documents'
    //   },
    //   onError
    // );
  }

  // Opening a file system with temporary storage
  requestFileSystem(
    // @ts-ignore
    window.PERSISTENT,
    1024 * 1024 * 1024 /* 1GB */,
    onFs,
    onError
  );
}

function readDirectory(directory) {
  const dirReader = directory.createReader();
  let entries = [];

  const getEntries = () => {
    dirReader.readEntries(
      (results) => {
        if (results.length) {
          entries = entries.concat(toArray(results));
          getEntries();
        }
      },
      (error) => {
        /* handle error — error is a FileError object */
      }
    );
  };

  getEntries();
  return entries;
}

function handleStartMedia(item: { type: MediaTypeEnum; txt: string }) {
  currentMediaType.value = item.type;
  showMediaModalCpt.value = true;
}
</script>

<style lang="scss" scoped>
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

      :deep(canvas) {
        // width: 100%;
      }

      .add-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0 20px;
        height: 50px;
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
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 5px 0;
        font-size: 14px;
        &:hover {
          .control {
            display: flex;
            align-items: center;
          }
        }
        .control {
          display: none;
          .control-item {
            cursor: pointer;
            &:not(:last-child) {
              margin-right: 6px;
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
      padding: 10px;
      width: 100%;
      border-radius: 6px;
      background-color: papayawhip;
      text-align: initial;
      .title {
        margin-bottom: 10px;
      }
      .list {
        overflow: scroll;
        height: 360px;

        @extend %hideScrollbar;

        .item {
          margin-bottom: 10px;
          font-size: 12px;
          .name {
            color: #9499a0;
          }
          .msg {
            color: #61666d;
          }
        }
      }

      .send-msg {
        position: absolute;
        bottom: 10px;
        left: 50%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: calc(100% - 20px);
        transform: translateX(-50%);
        .ipt {
          display: block;
          box-sizing: border-box;
          margin: 0 auto;
          margin-right: 10px;
          padding: 10px;
          width: 80%;
          height: 30px;
          outline: none;
          border: 1px solid hsla(0, 0%, 60%, 0.2);
          border-radius: 4px;
          background-color: #f1f2f3;
          font-size: 14px;
        }
      }
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
