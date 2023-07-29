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
        <AudioRoomTip></AudioRoomTip>
        <canvas
          id="pushCanvasRef"
          ref="pushCanvasRef"
        ></canvas>
        <div
          v-if="!appStore.allTrack || appStore.allTrack.length <= 0"
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
            v-for="(item, index) in appStore.allTrack"
            :key="index"
            class="item"
          >
            <span class="name">
              ({{ item.audio === 1 ? '音频' : '视频' }}){{ item.mediaName }}
            </span>
            <div
              class="del"
              @click="handleDelTrack(item)"
            >
              x
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
  </div>
</template>

<script lang="ts" setup>
import { fabric } from 'fabric';
import { NODE_ENV } from 'script/constant';
import { markRaw, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as workerTimers from 'worker-timers';

import { usePush } from '@/hooks/use-push';
import { DanmuMsgTypeEnum, MediaTypeEnum, liveTypeEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { createVideo, generateBase64, getRandomEnglishString } from '@/utils';

import MediaModalCpt from './mediaModal/index.vue';
import SelectMediaModalCpt from './selectMediaModal/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const currentMediaType = ref(MediaTypeEnum.camera);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const fabricCanvas = ref<fabric.Canvas>();
const localVideoRef = ref<HTMLVideoElement>();
const webAudioTrack = ref<MediaStreamTrack>();
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

function handleStartLive() {
  lastCoverImg.value = generateBase64(pushCanvasRef.value!);
  // const video = createVideo({});
  // document.body.appendChild(video);
  audioCtx.value = new AudioContext();
  const gainNode = audioCtx.value.createGain();

  appStore.allTrack.forEach((item) => {
    if (item.audio === 1) {
      if (!audioCtx.value) return;
      // const destination = audioCtx.value.createMediaStreamDestination();
      const audioInput = audioCtx.value.createMediaStreamSource(item.stream);
      // gainNode.connect(destination);
      audioInput.connect(gainNode);
    }
  });
  const destination = audioCtx.value.createMediaStreamDestination();
  // video.srcObject = destination.stream;
  gainNode.connect(destination);

  // video.onloadeddata = () => {
  // @ts-ignore
  // webAudioTrack.value = video.srcObject!.getAudioTracks()[0];
  // canvasVideoStream.value?.addTrack(webAudioTrack.value!);
  canvasVideoStream.value?.addTrack(destination.stream.getAudioTracks()[0]);
  startLive();
  // };
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
  return new Promise<any>((resolve) => {
    video.onloadedmetadata = () => {
      const width = stream.getVideoTracks()[0].getSettings().width!;
      const height = stream.getVideoTracks()[0].getSettings().height!;
      let ratio = 1;
      if (width > wrapSize.width) {
        const r1 = wrapSize.width / width;
        ratio = r1;
      }
      if (height > wrapSize.height) {
        const r1 = wrapSize.height / height;
        if (ratio > r1) {
          ratio = r1;
        }
      }

      video.width = width;
      video.height = height;

      const dom = markRaw(
        new fabric.Image(video, {
          top: 0,
          left: 0,
          width,
          height,
        })
      );
      dom.scale(ratio);
      fabricCanvas.value!.add(dom);
      function renderFrame() {
        fabricCanvas.value?.renderAll();
        window.requestAnimationFrame(renderFrame);
      }

      renderFrame();

      canvasVideoStream.value = pushCanvasRef.value!.captureStream();
      resolve(dom);
    };
  });
}

function initCanvas() {
  const resolutionHeight = currentResolutionRatio.value;
  const resolutionWidth = currentResolutionRatio.value * videoRatio.value;
  const wrapWidth = containerRef.value!.getBoundingClientRect().width;
  const ratio = wrapWidth / resolutionWidth;
  scaleRatio.value = ratio;
  const wrapHeight = resolutionHeight * ratio;
  // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
  // upper-canvas: 操作时候的canvas
  const ins = markRaw(new fabric.Canvas(pushCanvasRef.value!));
  ins.setWidth(wrapWidth);
  ins.setHeight(wrapHeight);
  ins.setBackgroundColor('black', () => {});
  wrapSize.width = wrapWidth;
  wrapSize.height = wrapHeight;
  fabricCanvas.value = ins;
}

onMounted(() => {
  initCanvas();
  document.addEventListener('visibilitychange', onPageVisibility);
  handleAudioTrack();
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onPageVisibility);
});

function handleAudioTrack() {
  audioCtx.value = new AudioContext();
  // const destination = audioCtx.value.createMediaStreamDestination();
  // const gainNode = audioCtx.value.createGain();
  // gainNode.connect(destination);
}

function selectMediaOk(val: MediaTypeEnum) {
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

async function addMediaOk(val: {
  type: MediaTypeEnum;
  deviceId: string;
  mediaName: string;
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
      stream: event,
      streamid: event.id,
      trackid: event.getVideoTracks()[0].id,
      canvasDom: undefined,
    };

    const canvasDom = await autoCreateVideo({
      stream: event,
    });
    videoTrack.canvasDom = canvasDom;

    const audio = event.getAudioTracks();
    if (audio.length) {
      const audioTrack = {
        id: getRandomEnglishString(8),
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.screen,
        track: event.getAudioTracks()[0],
        stream: event,
        streamid: event.id,
        trackid: event.getAudioTracks()[0].id,
      };
      appStore.setAllTrack([...appStore.allTrack, videoTrack, audioTrack]);
      addTrack(videoTrack);
      addTrack(audioTrack);
    } else {
      appStore.setAllTrack([...appStore.allTrack, videoTrack]);
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
      stream: event,
      streamid: event.id,
      trackid: event.getVideoTracks()[0].id,
      canvasDom: undefined,
    };
    const canvasDom = await autoCreateVideo({
      stream: event,
    });
    videoTrack.canvasDom = canvasDom;

    appStore.setAllTrack([...appStore.allTrack, videoTrack]);
    addTrack(videoTrack);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    if (
      isSRS &&
      appStore.allTrack.filter((item) => item.audio === 1).length >= 1
    ) {
      // window.$message.error('srs模式最多只能有一个音频');
      // return;
    }
    const audioTrack = {
      id: getRandomEnglishString(8),
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      stream: event,
      streamid: event.id,
      trackid: event.getAudioTracks()[0].id,
    };
    appStore.setAllTrack([...appStore.allTrack, audioTrack]);
    addTrack(audioTrack);

    console.log('获取麦克风成功');
  }
}

function handleDelTrack(item: AppRootState['allTrack'][0]) {
  console.log('handleDelTrack', item);
  if (item.canvasDom !== undefined) {
    // @ts-ignore
    fabricCanvas.value?.remove(item.canvasDom);
  }
  const res = appStore.allTrack.filter((iten) => iten.id !== item.id);
  appStore.setAllTrack(res);
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
        font-size: 12px;
        &:hover {
          .del {
            display: block;
          }
        }
        .del {
          display: none;
          cursor: pointer;
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
