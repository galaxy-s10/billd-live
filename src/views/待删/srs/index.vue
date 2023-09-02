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
            v-for="(item, index) in appStore.allTrack.filter(
              (item) => !item.hidden
            )"
            :key="index"
            class="item"
          >
            <span class="name">
              ({{ mediaTypeEnumMap[item.type] }}){{ item.mediaName }}
            </span>
            <div class="control">
              <div
                v-if="item.audio === 1"
                class="control-item"
                @click="handleChangeMuted(item)"
              >
                <n-icon size="16">
                  <VolumeMuteOutline v-if="item.muted"></VolumeMuteOutline>
                  <VolumeHighOutline v-else></VolumeHighOutline>
                </n-icon>
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
import {
  Close,
  CreateOutline,
  VolumeHighOutline,
  VolumeMuteOutline,
} from '@vicons/ionicons5';
import { fabric } from 'fabric';
import { UploadFileInfo } from 'naive-ui';
import {
  Raw,
  markRaw,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import * as workerTimers from 'worker-timers';

import { mediaTypeEnumMap } from '@/constant';
import { usePush } from '@/hooks/use-push';
import { useRTCParams } from '@/hooks/use-rtc-params';
import { DanmuMsgTypeEnum, LiveRoomTypeEnum, MediaTypeEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { useResourceCacheStore } from '@/store/cache';
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

import MediaModalCpt from '../mediaModal/index.vue';
import OpenMicophoneTipCpt from '../openMicophoneTip/index.vue';
import SelectMediaModalCpt from '../selectMediaModal/index.vue';

const userStore = useUserStore();
const appStore = useAppStore();
const resourceCacheStore = useResourceCacheStore();
const { maxBitrate, maxFramerate, resolutionRatio, allMediaTypeList } =
  useRTCParams();

const {
  confirmRoomName,
  startLive,
  endLive,
  sendDanmu,
  keydownDanmu,
  addTrack,
  delTrack,
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
const showOpenMicophoneTipCpt = ref(false);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const webaudioVideo = ref<HTMLVideoElement>();
const fabricCanvas = ref<fabric.Canvas>();
const audioCtx = ref<AudioContext>();
const startTime = ref(+new Date());
// const startTime = ref(1692807352565); // 1693027352565

const timeCanvasDom = ref<Raw<fabric.Text>[]>([]);
const stopwatchCanvasDom = ref<Raw<fabric.Text>[]>([]);
const wrapSize = reactive({
  width: 0,
  height: 0,
});
const workerTimerId = ref(-1);
const bodyAppendChildElArr = ref<HTMLElement[]>([]);

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

onMounted(() => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  initUserMedia();
  initCanvas();
  handleCache();
});

onUnmounted(() => {
  bodyAppendChildElArr.value.forEach((el) => {
    el.remove();
  });
  clearFrame();
});

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
  const delay = 1000 / 60; // 16.666666666666668
  workerTimerId.value = workerTimers.setInterval(() => {
    renderAll();
  }, delay);
  console.log('workerTimerId.value', workerTimerId.value);
}

function handleMixedAudio() {
  console.log('handleMixedAudio');
  const allAudioTrack = appStore.allTrack.filter((item) => item.audio === 1);
  audioCtx.value = new AudioContext();
  const gainNode = audioCtx.value.createGain();
  allAudioTrack.forEach((item) => {
    if (!audioCtx.value || !item.stream) return;
    const audioInput = audioCtx.value.createMediaStreamSource(item.stream);
    audioInput.connect(gainNode);
    console.log('混流', item.stream?.id, item.stream);
  });

  const destination = audioCtx.value.createMediaStreamDestination();
  if (canvasVideoStream.value?.getAudioTracks()[0]) {
    canvasVideoStream.value.removeTrack(
      canvasVideoStream.value?.getAudioTracks()[0]
    );
  }
  canvasVideoStream.value?.addTrack(destination.stream.getAudioTracks()[0]);
  // streamTmp = destination.stream;
  if (canvasVideoStream.value?.getAudioTracks()[0]) {
    canvasVideoStream.value.removeTrack(
      canvasVideoStream.value?.getAudioTracks()[0]
    );
    canvasVideoStream.value?.addTrack(destination.stream.getAudioTracks()[0]);
  } else {
    canvasVideoStream.value?.addTrack(destination.stream.getAudioTracks()[0]);
  }
  console.log(
    canvasVideoStream.value?.getAudioTracks(),
    'canvasVideoStreamcanvasVideoStream'
  );
  gainNode.connect(destination);
  if (webaudioVideo.value) {
    webaudioVideo.value.remove();
  }
  webaudioVideo.value = createVideo({ appendChild: true });
  webaudioVideo.value.className = 'web-audio-video';
  webaudioVideo.value.srcObject = destination.stream;
}

function handleStartLive() {
  handleMixedAudio();
  lastCoverImg.value = generateBase64(pushCanvasRef.value!);
  startLive({ type: LiveRoomTypeEnum.user_srs, receiver: mySocketId });
}

function handleScale({ width, height }: { width: number; height: number }) {
  const resolutionHeight =
    currentResolutionRatio.value * window.devicePixelRatio;
  const resolutionWidth =
    currentResolutionRatio.value *
    window.devicePixelRatio *
    appStore.videoRatio;
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
  console.warn('autoCreateVideo', id);
  const videoEl = createVideo({ appendChild: true });
  if (muted !== undefined) {
    videoEl.muted = muted;
  }
  videoEl.srcObject = stream;
  bodyAppendChildElArr.value.push(videoEl);
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
      console.log('当前类型', iten.type);
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
      console.log('当前类型', iten.type);
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
  console.log('initCanvas', { resolutionWidth, resolutionHeight });
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
    resourceCacheStore.setList(appStore.allTrack);
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
    resourceCacheStore.setList(appStore.allTrack);
  });
}

async function handleCache() {
  const res: AppRootState['allTrack'] = [];
  const queue: any[] = [];
  resourceCacheStore.list.forEach((item) => {
    // @ts-ignore
    const obj: AppRootState['allTrack'][0] = {};
    obj.audio = item.audio;
    obj.video = item.video;
    obj.id = item.id;
    obj.type = item.type;
    obj.hidden = item.hidden;
    obj.mediaName = item.mediaName;
    obj.muted = item.muted;
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
        videoEl.src = url;
        bodyAppendChildElArr.value.push(videoEl);
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
    if (item.type === MediaTypeEnum.media && item.video === 1) {
      queue.push(handleMediaVideo());
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
  appStore.setAllTrack(res);
}

function selectMediaOk(val: MediaTypeEnum) {
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

function setScaleInfo({ track, canvasDom }) {
  [1, 2, 3, 4].forEach((devicePixelRatio) => {
    track.scaleInfo[devicePixelRatio] = {
      scaleX: 1 / devicePixelRatio,
      scaleY: 1 / devicePixelRatio,
    };
  });
  if (window.devicePixelRatio !== 1) {
    const ratio = 1 / window.devicePixelRatio;
    canvasDom.scale(ratio);
    track.scaleInfo[window.devicePixelRatio] = {
      scaleX: ratio,
      scaleY: ratio,
    };
  }
}

async function addMediaOk(val: {
  type: MediaTypeEnum;
  deviceId: string;
  mediaName: string;
  txtInfo?: { txt: string; color: string };
  timeInfo?: { color: string };
  stopwatchInfo?: { color: string };
  imgInfo?: UploadFileInfo[];
  mediaInfo?: UploadFileInfo[];
}) {
  if (!audioCtx.value) {
    audioCtx.value = new AudioContext();
  }
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video: {
        deviceId: val.deviceId,
        // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
      },
      audio: true,
    });

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
    setScaleInfo({ canvasDom, track: videoTrack });
    videoTrack.videoEl = videoEl;
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;

    const audio = event.getAudioTracks();
    if (audio.length) {
      videoTrack.audio = 1;
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
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, videoTrack, audioTrack];
      appStore.setAllTrack(res);
      resourceCacheStore.setList(res);
      handleMixedAudio();
      // @ts-ignore
      addTrack(videoTrack);
      // @ts-ignore
      addTrack(audioTrack);
    } else {
      const res = [...appStore.allTrack, videoTrack];
      appStore.setAllTrack(res);
      resourceCacheStore.setList(res);
      // @ts-ignore
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
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
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
    setScaleInfo({ canvasDom, track: videoTrack });
    videoTrack.videoEl = videoEl;
    // @ts-ignore
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    resourceCacheStore.setList(res);
    // @ts-ignore
    addTrack(videoTrack);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    const audioTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(8),
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
      scaleInfo: {},
    };
    const res = [...appStore.allTrack, audioTrack];
    appStore.setAllTrack(res);
    resourceCacheStore.setList(res);
    handleMixedAudio();
    // @ts-ignore
    addTrack(audioTrack);

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
      console.log('val.txtInfo?.txt ', val.txtInfo?.txt);
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
      // @ts-ignore
      txtTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, txtTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    resourceCacheStore.setList(res);
    // @ts-ignore
    addTrack(txtTrack);

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
      // @ts-ignore
      timeTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, timeTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    resourceCacheStore.setList(res);
    // @ts-ignore
    addTrack(timeTrack);

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
      // @ts-ignore
      stopwatchTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, stopwatchTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    resourceCacheStore.setList(res);
    // @ts-ignore
    addTrack(stopwatchTrack);

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
      const ratio = handleScale({ width: imgEl.width, height: imgEl.height });
      setScaleInfo({ canvasDom, track: imgTrack });
      handleMoving({ canvasDom, id: imgTrack.id });
      handleScaling({ canvasDom, id: imgTrack.id });
      // @ts-ignore
      imgTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, imgTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    resourceCacheStore.setList(res);
    // @ts-ignore
    addTrack(imgTrack);

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
      videoEl.src = url;
      videoEl.muted = false;
      bodyAppendChildElArr.value.push(videoEl);
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
      setScaleInfo({ canvasDom, track: mediaVideoTrack });
      mediaVideoTrack.videoEl = videoEl;
      // @ts-ignore
      mediaVideoTrack.canvasDom = canvasDom;
      if (stream.getAudioTracks()[0]) {
        console.log('视频有音频', stream.getAudioTracks()[0]);
        mediaVideoTrack.audio = 1;
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
          scaleInfo: {},
        };
        // @ts-ignore
        const res = [...appStore.allTrack, audioTrack];
        appStore.setAllTrack(res);
        resourceCacheStore.setList(res);
        handleMixedAudio();
        // @ts-ignore

        addTrack(audioTrack);
      }
    }
    const res = [...appStore.allTrack, mediaVideoTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    resourceCacheStore.setList(res);
    // @ts-ignore

    addTrack(mediaVideoTrack);

    console.log('获取视频成功', fabricCanvas.value);
  }
  // canvasVideoStream.value = pushCanvasRef.value!.captureStream();
}

function handleChangeMuted(item: AppRootState['allTrack'][0]) {
  if (item.videoEl) {
    const res = !item.videoEl.muted;
    item.videoEl.muted = res;
    item.muted = res;
    resourceCacheStore.setList(appStore.allTrack);
  }
}

function handleEdit(item: AppRootState['allTrack'][0]) {
  console.log('handleEdit', item);
}

function handleDel(item: AppRootState['allTrack'][0]) {
  console.log('handleDel', item);
  if (item.canvasDom !== undefined) {
    // @ts-ignore
    fabricCanvas.value?.remove(item.canvasDom);
    item.videoEl?.remove();
  }
  const res = appStore.allTrack.filter((iten) => iten.id !== item.id);
  appStore.setAllTrack(res);
  resourceCacheStore.setList(res);
  delTrack(item);
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
