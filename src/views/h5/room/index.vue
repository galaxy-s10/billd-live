<template>
  <div class="h5-room-wrap">
    <div class="head">
      <div class="left">
        <div
          class="avatar"
          :style="{
            backgroundImage: `url(${liveRoomInfo?.user_live_room?.user.avatar})`,
          }"
        ></div>
        <div class="username">
          {{ liveRoomInfo?.user_live_room?.user.username }}
        </div>
      </div>
      <div class="right">
        <div
          class="btn"
          @click="router.push({ name: mobileRouterName.h5 })"
        >
          返回主页
        </div>
      </div>
    </div>
    <div
      v-loading="videoLoading"
      class="video-wrap"
    >
      <div
        class="cover"
        :style="{
          backgroundImage: `url(${liveRoomInfo?.cover_img})`,
        }"
      ></div>
      <!-- <video
        ref="canvasRef"
        autoplay
        webkit-playsinline="true"
        playsinline
        x-webkit-airplay="allow"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
        :muted="appStore.muted"
      ></video> -->
      <div ref="canvasRef"></div>
      <div
        v-if="showPlayBtn"
        class="tip-btn"
        @click="startPull"
      >
        点击播放
      </div>
      <VideoControls v-else></VideoControls>
    </div>
    <div class="danmu-list">
      <div class="title">弹幕专区</div>
      <div
        ref="containerRef"
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
              {{ item.userInfo?.username || item.socket_id }}进入直播！
            </span>
          </template>
          <template v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved">
            <span class="name system">系统通知：</span>
            <span class="msg">
              {{ item.userInfo?.username || item.socket_id }}离开直播！
            </span>
          </template>
        </div>
      </div>
    </div>
    <div
      ref="bottomRef"
      class="send-msg"
    >
      <input
        v-model="danmuStr"
        class="ipt"
        @keydown="keydownDanmu"
      />
      <n-button
        type="info"
        size="small"
        color="#ffd700"
        @click="sendDanmu"
      >
        发送
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchFindLiveRoom } from '@/api/liveRoom';
import { useHlsPlay } from '@/hooks/use-play';
import { usePull } from '@/hooks/use-pull';
import { DanmuMsgTypeEnum, ILiveRoom, liveTypeEnum } from '@/interface';
import router, { mobileRouterName } from '@/router';
import { videoToCanvas } from '@/utils';

const route = useRoute();

const bottomRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLVideoElement>();
const localVideoRef = ref<HTMLVideoElement[]>([]);
const showPlayBtn = ref(true);

const { hlsVideoEl, startHlsPlay } = useHlsPlay();

const {
  initPull,
  closeWs,
  closeRtc,
  getSocketId,
  keydownDanmu,
  sendDanmu,
  batchSendOffer,
  startGetUserMedia,
  startGetDisplayMedia,
  addTrack,
  addVideo,
  videoLoading,
  balance,
  roomName,
  userName,
  userAvatar,
  currentLiveRoom,
  coverImg,
  roomNoLive,
  damuList,
  giftList,
  liveUserList,
  danmuStr,
  localStream,
  sender,
  sidebarList,
} = usePull({
  localVideoRef,
  canvasRef,
  liveType: route.query.liveType as liveTypeEnum,
  isSRS: route.query.liveType === liveTypeEnum.srsWebrtcPull,
});

const liveRoomInfo = ref<ILiveRoom>();

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      if (containerRef.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight;
      }
    }, 0);
  }
);

async function getLiveRoomInfo() {
  const res = await fetchFindLiveRoom(route.params.roomId as string);
  if (res.code === 200) {
    liveRoomInfo.value = res.data;
  }
}

async function startPull() {
  showPlayBtn.value = false;
  videoLoading.value = true;

  const { width, height } = await startHlsPlay({
    hlsurl: liveRoomInfo.value!.hls_url!,
  });
  videoToCanvas({
    videoEl: hlsVideoEl.value!,
    targetEl: canvasRef.value!,
    width,
    height,
  });
  videoLoading.value = false;
}

onMounted(() => {
  scrollTo({ top: 0 });
  getLiveRoomInfo();
  initPull(false);
  if (containerRef.value && bottomRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      containerRef.value.getBoundingClientRect().top;
    containerRef.value.style.height = `${res}px`;
  }
});
</script>

<style lang="scss" scoped>
.h5-room-wrap {
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 70px;
    background-color: black;
    color: white;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;

        @extend %containBg;
      }
      .username {
        margin-left: 10px;
      }
    }
    .right {
      .btn {
      }
    }
  }
  .video-wrap {
    position: relative;
    overflow: hidden;
    flex: 1;
    height: 230px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    .cover {
      position: absolute;
      background-position: center center;
      background-size: cover;
      filter: blur(10px);

      inset: 0;
    }
    :deep(canvas) {
      position: absolute;
      top: 0;
      left: 50%;
      height: 100%;
      transform: translate(-50%);

      user-select: nones;
    }
    .tip-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      align-items: center;
      padding: 10px 20px;
      border: 2px solid rgba($color: papayawhip, $alpha: 0.5);
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.3);
      color: $theme-color-gold;
      font-size: 14px;
      cursor: pointer;
      transform: translate(-50%, -50%);
      &:hover {
        background-color: rgba($color: papayawhip, $alpha: 0.5);
        color: white;
      }
    }
  }

  .danmu-list {
    box-sizing: border-box;
    padding: 0 15px;
    background-color: #0c1622;
    text-align: initial;
    .title {
      padding: 15px 0;
      color: #fff;
      font-size: 16px;
    }
    .list {
      overflow-y: scroll;
      height: 100vh;

      @extend %hideScrollbar;
    }
    .item {
      margin-bottom: 10px;
      font-size: 12px;
      .name {
        color: #ccc;
        &.system {
          color: red;
        }
      }
      .msg {
        color: #fff;
      }
    }
  }
  .send-msg {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    box-sizing: border-box;
    padding: 0 10px;
    width: 100%;
    height: 40px;
    background-color: #0c1622;
    .ipt {
      display: block;
      box-sizing: border-box;
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
</style>
