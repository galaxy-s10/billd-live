<template>
  <div class="h5-room-wrap">
    <div class="head">
      <div class="left">
        <div
          class="avatar"
          :style="{
            backgroundImage: `url(${roomLiveing?.live?.user?.avatar})`,
          }"
        ></div>
        <div class="username">
          {{ roomLiveing?.live?.user?.username }}
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
          backgroundImage: `url(${roomLiveing?.live?.live_room?.cover_img})`,
        }"
      ></div>
      <div
        ref="canvasRef"
        class="media-list"
        :class="{ item: appStore.allTrack.length > 1 }"
      ></div>
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
        :style="{ height: height + 'px' }"
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
import { usePull } from '@/hooks/use-pull';
import { DanmuMsgTypeEnum, LiveRoomTypeEnum, liveTypeEnum } from '@/interface';
import router, { mobileRouterName } from '@/router';
import { useAppStore } from '@/store/app';

const route = useRoute();
const appStore = useAppStore();

const bottomRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLVideoElement>();
const localVideoRef = ref<HTMLVideoElement[]>([]);
const showPlayBtn = ref(false);
const height = ref(0);

const {
  initPull,
  closeWs,
  closeRtc,
  getSocketId,
  keydownDanmu,
  sendDanmu,
  addVideo,
  handleHlsPlay,
  roomLiveType,
  roomLiveing,
  autoplayVal,
  videoLoading,
  roomNoLive,
  damuList,
  liveUserList,
  sidebarList,
  danmuStr,
  liveRoomInfo,
} = usePull({
  localVideoRef,
  canvasRef,
  liveType: liveTypeEnum.srsHlsPull,
  isSRS: false,
});

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
  try {
    videoLoading.value = true;
    const res = await fetchFindLiveRoom(route.params.roomId as string);
    if (res.code === 200) {
      if (res.data.type === LiveRoomTypeEnum.user_wertc) {
        autoplayVal.value = true;
        roomLiveType.value = liveTypeEnum.webrtcPull;
        showPlayBtn.value = false;
      } else {
        showPlayBtn.value = true;
      }
      initPull(autoplayVal.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    videoLoading.value = false;
  }
}

function startPull() {
  showPlayBtn.value = false;
  handleHlsPlay();
}

onMounted(() => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  getLiveRoomInfo();
  if (containerRef.value && bottomRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      containerRef.value.getBoundingClientRect().top;
    height.value = res;
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
    .media-list {
      position: relative;
      overflow-y: scroll;
      height: 230px;
      :deep(video) {
        display: block;
        width: 100%;
        height: 100%;
      }
      :deep(canvas) {
        display: block;
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
    // :deep(video) {
    //   position: absolute;
    //   top: 0;
    //   left: 50%;
    //   width: 100%;
    //   height: 100%;
    //   transform: translate(-50%);

    //   user-select: nones;
    // }
    // :deep(canvas) {
    //   position: absolute;
    //   top: 0;
    //   left: 50%;
    //   width: 100%;
    //   height: 100%;
    //   transform: translate(-50%);

    //   user-select: nones;
    // }
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
