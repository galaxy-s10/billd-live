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
        <div class="video-wrap">
          <AudioRoomTip></AudioRoomTip>
          <div
            ref="localVideoRef"
            class="media-list"
            :class="{ item: appStore.allTrack.length > 1 }"
          ></div>
          <!-- <video
            id="localVideo"
            ref="localVideo2Ref"
            autoplay
            webkit-playsinline="true"
            playsinline
            x-webkit-airplay="allow"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            muted
            :controls="NODE_ENV === 'development' ? true : false"
            @contextmenu.prevent
          ></video> -->
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

        <div class="sidebar">
          <div class="title">在线人员</div>
          <div
            v-for="(item, index) in liveUserList.filter(
              (item) => item.id !== getSocketId()
            )"
            :key="index"
            class="item"
          >
            <video
              :ref="(el) => (remoteVideoRef[item.id] = el)"
              autoplay
              webkit-playsinline="true"
              playsinline
              x-webkit-airplay="allow"
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x5-video-orientation="portraint"
              muted
            ></video>
            <div>{{ item.userInfo?.username || item.id }}</div>
          </div>
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
                socketId：{{ getSocketId() }}
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
              @click="startLive"
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
import { getRandomString } from 'billd-utils';
import { NODE_ENV } from 'script/constant';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { usePush } from '@/hooks/use-push';
import { DanmuMsgTypeEnum, MediaTypeEnum, liveTypeEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

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
const localVideoRef = ref<HTMLVideoElement>();
const remoteVideoRef = ref<HTMLVideoElement[]>([]);
const isSRS = route.query.liveType === liveTypeEnum.srsPush;
const {
  confirmRoomName,
  getSocketId,
  startLive,
  endLive,
  sendDanmu,
  keydownDanmu,
  localStream,
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

onMounted(() => {
  if (topRef.value && bottomRef.value && containerRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      topRef.value.getBoundingClientRect().top;
    containerRef.value.style.height = `${res}px`;
  }
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
}) {
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video: {
        deviceId: val.deviceId,
        height: currentResolutionRatio.value,
        frameRate: { max: currentMaxFramerate.value },
      },
      audio: true,
    });
    const videoTrack = {
      id: getRandomString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.screen,
      track: event.getVideoTracks()[0],
      stream: event,
      streamid: event.id,
      trackid: event.getVideoTracks()[0].id,
    };
    const audio = event.getAudioTracks();
    if (audio.length) {
      if (
        isSRS &&
        appStore.allTrack.filter((item) => item.audio === 1).length >= 1
      ) {
        window.$message.error('srs模式最多只能有一个音频');
        return;
      }
      const audioTrack = {
        id: getRandomString(8),
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
      if (
        isSRS &&
        appStore.allTrack.filter((item) => item.video === 1).length >= 1
      ) {
        window.$message.error('srs模式最多只能有一个视频');
        return;
      }
      appStore.setAllTrack([...appStore.allTrack, videoTrack]);
      addTrack(videoTrack);
    }

    console.log('获取窗口成功');
  } else if (val.type === MediaTypeEnum.camera) {
    const event = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: val.deviceId,
        height: currentResolutionRatio.value,
        frameRate: { max: currentMaxFramerate.value },
      },
      audio: false,
    });
    if (
      isSRS &&
      appStore.allTrack.filter((item) => item.video === 1).length >= 1
    ) {
      window.$message.error('srs模式最多只能有一个视频');
      return;
    }
    const track = {
      id: getRandomString(8),
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.camera,
      track: event.getVideoTracks()[0],
      stream: event,
      streamid: event.id,
      trackid: event.getVideoTracks()[0].id,
    };
    appStore.setAllTrack([...appStore.allTrack, track]);
    addTrack(track);
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
      window.$message.error('srs模式最多只能有一个音频');
      return;
    }
    const track = {
      id: getRandomString(8),
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      stream: event,
      streamid: event.id,
      trackid: event.getAudioTracks()[0].id,
    };
    appStore.setAllTrack([...appStore.allTrack, track]);
    addTrack(track);
    console.log('获取麦克风成功');
  }
}

function handleDelTrack(item: AppRootState['allTrack'][0]) {
  console.log('handleDelTrack', item);
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
  margin: 20px auto 0;
  min-width: $large-width;
  height: 700px;
  text-align: center;
  .left {
    position: relative;
    display: inline-block;
    overflow: hidden;
    box-sizing: border-box;
    width: $large-left-width;
    height: 100%;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;
    vertical-align: top;

    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      background-color: #fff;
      .video-wrap {
        position: relative;
        display: flex;
        flex: 1;
        justify-content: center;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.5);
        .media-list {
          :deep(video) {
            width: 100%;
            height: 100%;
          }
          :deep(canvas) {
            width: 100%;
            height: 100%;
          }
          &.item {
            :deep(video) {
              width: 50%;
              height: initial !important;
            }
            :deep(canvas) {
              width: 50%;
              height: initial !important;
            }
          }
        }

        // #localVideo {
        //   max-width: 100%;
        //   max-height: 100%;
        // }
        .add-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 20px;
          height: 50px;
          border-radius: 5px;
          background-color: white;
          transform: translate(-50%, -50%);
        }
      }
      .sidebar {
        overflow: scroll;
        width: 130px;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.3);

        @extend %hideScrollbar;
        .title {
          color: white;
        }
        .join {
          color: white;
          cursor: pointer;
        }
        video {
          max-width: 100%;
        }
      }
    }
    .room-control {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background-color: papayawhip;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
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
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    margin-left: 10px;
    width: 240px;
    height: 100%;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;

    .resource-card {
      position: relative;
      box-sizing: border-box;
      margin-bottom: 5%;
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
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      height: 400px;
      border-radius: 6px;
      background-color: papayawhip;
      text-align: initial;
      .title {
        margin-bottom: 10px;
      }
      .list {
        overflow: scroll;
        margin-bottom: 10px;
        height: 300px;

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
        display: flex;
        align-items: center;
        box-sizing: border-box;
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
// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .push-wrap {
    .left {
      width: $medium-left-width;
    }
    .right {
      .list {
        .item {
        }
      }
    }
  }
}
</style>
