<template>
  <div class="h5-room-wrap">
    <div class="head">
      <div class="left">
        <div
          class="avatar"
          :style="{
            backgroundImage: `url(${anchorInfo?.avatar})`,
          }"
        ></div>
        <div class="username">
          {{ anchorInfo?.username }}
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
      ref="videoWrapTmpRef"
      :style="{
        height: videoWrapHeight + 'px',
        '--max-height': videoWrapHeight + 'px',
      }"
    >
      <div
        class="cover"
        :style="{
          backgroundImage: `url(${appStore.liveRoomInfo?.cover_img})`,
        }"
      ></div>
      <div
        v-if="!roomLiving"
        class="no-live"
      >
        主播还没开播~
      </div>
      <div
        class="media-list"
        ref="remoteVideoRef"
        :class="{ item: appStore.allTrack.length > 1 }"
      ></div>
      <div
        v-if="showPlayBtn && roomLiving && appStore.liveRoomInfo"
        class="tip-btn"
        @click="startPull"
      >
        点击播放
      </div>
      <VideoControls
        v-else
        :resolution="videoHeight"
        @refresh="handleRefresh"
      ></VideoControls>
    </div>
    <div class="n-tab-wrap">
      <n-tabs
        type="line"
        animated
      >
        <n-tab-pane
          name="danmu"
          tab="聊天"
        >
          <div class="danmu-list">
            <div
              ref="danmuListRef"
              class="list"
              :style="{ height: containerHeight + 'px' }"
            >
              <div
                v-for="(item, index) in damuList"
                :key="index"
                class="item"
              >
                <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
                  <span class="time"
                    >[{{ formatTimeHour(item.send_msg_time) }}]</span
                  >
                  <span class="name">
                    <span v-if="item.userInfo">
                      <span>{{ item.userInfo.username }}</span>
                      <span v-if="MODULE_CONFIG_SWITCH.pullShowAuth">
                        [{{
                          item.userInfo.roles?.map((v) => v.role_name).join()
                        }}]
                      </span>
                    </span>
                    <span v-else>
                      <span>{{ item.socket_id }}</span>
                      <span v-if="MODULE_CONFIG_SWITCH.pullShowAuth">
                        [游客]
                      </span>
                    </span>
                    <span>：</span>
                  </span>
                  <span
                    class="msg"
                    v-if="item.msgIsFile === WsMessageMsgIsFileEnum.no"
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
                <template
                  v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin"
                >
                  <span class="name system">系统通知：</span>
                  <span class="msg">
                    {{ item.userInfo?.username || item.socket_id }}进入直播！
                  </span>
                </template>
                <template
                  v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved"
                >
                  <span class="name system">系统通知：</span>
                  <span class="msg">
                    {{ item.userInfo?.username || item.socket_id }}离开直播！
                  </span>
                </template>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane
          name="customerService"
          tab="客服"
        >
          <div
            class="customerService-wrap"
            :style="{ height: containerHeight + 'px' }"
          >
            <img
              class="qrcode"
              v-if="frontendWechatQrcode !== ''"
              :src="frontendWechatQrcode"
              alt=""
            />
            <div class="tip">打开微信扫一扫添加客服</div>
          </div>
        </n-tab-pane>
        <n-tab-pane
          name="liveRoomInfo"
          tab="直播间信息"
        >
          <div
            class="liveRoomInfo-wrap"
            :style="{ height: containerHeight + 'px' }"
          >
            <div>直播间名称：{{ appStore.liveRoomInfo?.name }}</div>
            <div>直播间简介：{{ appStore.liveRoomInfo?.desc }}</div>
            <div>
              直播间分区：{{
                appStore.liveRoomInfo?.areas?.[0].name || '暂无分区'
              }}
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>

    <div
      ref="bottomRef"
      class="send-msg"
    >
      <div
        class="emoji-list"
        v-if="showEmoji"
      >
        <div
          class="item"
          v-for="(item, index) in emojiArray"
          :key="index"
          @click="handlePushStr(item)"
        >
          {{ item }}
        </div>
      </div>
      <div
        class="face"
        @click="showEmoji = !showEmoji"
      ></div>
      <input
        v-model="danmuStr"
        class="ipt"
        placeholder="发个弹幕吧~"
        @keydown="keydownDanmu"
      />
      <n-button
        type="info"
        size="small"
        :color="THEME_COLOR"
        @click="sendDanmu"
      >
        发送
      </n-button>
    </div>
    <LoginModal v-if="appStore.showLoginModal"></LoginModal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchFindLiveConfigByKey } from '@/api/liveConfig';
import { fetchFindLiveRoom } from '@/api/liveRoom';
import { MODULE_CONFIG_SWITCH, THEME_COLOR } from '@/constant';
import { emojiArray } from '@/emoji';
import { usePull } from '@/hooks/use-pull';
import { DanmuMsgTypeEnum, WsMessageMsgIsFileEnum } from '@/interface';
import router, { mobileRouterName } from '@/router';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { formatTimeHour } from '@/utils';

const route = useRoute();
const cacheStore = usePiniaCacheStore();
const appStore = useAppStore();

const videoWrapTmpRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const showPlayBtn = ref(false);
const showEmoji = ref(false);

const containerHeight = ref(0);
const videoWrapHeight = ref(0);
const frontendWechatQrcode = ref('');
const remoteVideoRef = ref<HTMLDivElement>();
const roomId = ref(route.params.roomId as string);
const {
  videoWrapRef,
  handlePlay,
  initPull,
  keydownDanmu,
  sendDanmu,
  closeRtc,
  closeWs,
  handleSendGetLiveUser,
  isPlaying,
  autoplayVal,
  videoLoading,
  damuList,
  danmuStr,
  roomLiving,
  anchorInfo,
  remoteVideo,
  videoHeight,
} = usePull(roomId.value);

onUnmounted(() => {
  closeWs();
  closeRtc();
  appStore.showLoginModal = false;
});

onMounted(() => {
  videoWrapRef.value = videoWrapTmpRef.value;
  getWechatQrcode();
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  videoWrapHeight.value =
    document.documentElement.clientWidth / appStore.videoRatio;
  nextTick(() => {
    if (danmuListRef.value && bottomRef.value) {
      const res =
        bottomRef.value.getBoundingClientRect().top -
        danmuListRef.value.getBoundingClientRect().top;
      containerHeight.value = res;
    }
  });
  getLiveRoomInfo();
  handleSendGetLiveUser(Number(roomId.value));
});

function handlePushStr(str) {
  danmuStr.value += str;
  showEmoji.value = false;
}

watch(
  () => remoteVideo.value,
  (newVal) => {
    newVal.forEach((item) => {
      remoteVideoRef.value?.appendChild(item);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => isPlaying.value,
  (newVal) => {
    if (newVal) {
      showPlayBtn.value = false;
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

function handleRefresh() {
  if (appStore.liveRoomInfo) {
    handlePlay(appStore.liveRoomInfo);
  }
}

async function getLiveRoomInfo() {
  try {
    videoLoading.value = true;
    const res = await fetchFindLiveRoom(roomId.value);
    if (res.code === 200) {
      appStore.setLiveRoomInfo(res.data);
      if (res.data.type === LiveRoomTypeEnum.wertc_live) {
        autoplayVal.value = true;
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
  cacheStore.setMuted(false);
  showPlayBtn.value = false;
  handlePlay(appStore.liveRoomInfo!);
}

async function getWechatQrcode() {
  try {
    const res = await fetchFindLiveConfigByKey('frontend_wechat_qrcode');
    if (res.code === 200) {
      frontendWechatQrcode.value = res.data.value;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style lang="scss" scoped>
.h5-room-wrap {
  height: 100vh;
  background-color: #0c1622;
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
    background-color: rgba($color: #000000, $alpha: 0.5);
    .cover {
      position: absolute;
      z-index: -1;
      background-position: center center;
      background-size: cover;
      filter: blur(10px);

      inset: 0;
    }
    .no-live {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 20;
      color: white;
      font-size: 28px;
      transform: translate(-50%, -50%);
    }
    .media-list {
      position: relative;
      :deep(video) {
        position: absolute;
        left: 50%;
        display: block;
        max-width: 100vw;
        max-height: var(--max-height);
        transform: translateX(-50%);
      }
      :deep(canvas) {
        position: absolute;
        left: 50%;
        display: block;
        max-width: 100vw;
        max-height: var(--max-height);
        transform: translateX(-50%);
      }
    }
    .tip-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 20;
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

  .n-tab-wrap {
    padding-left: 10px;
    background: #0c1622;
    color: white;
    :deep(.n-tabs-tab) {
      --n-tab-text-color: white;
    }
    :deep(.n-tabs-nav-scroll-content) {
      border-bottom: 0 !important;
    }

    // :deep(.n-tabs-pane-wrapper) {
    //   --n-pane-text-color: white;
    // }
  }
  .danmu-list {
    box-sizing: border-box;
    padding: 0;
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
      box-sizing: border-box;
      margin-bottom: 4px;
      padding: 2px;
      white-space: normal;
      word-wrap: break-word;
      font-size: 13px;

      .name,
      .time {
        color: white;
        opacity: 0.8;
        cursor: pointer;
        &.system {
          color: red;
        }
      }
      .msg {
        margin-top: 4px;
        color: white;
        &.img {
          img {
            width: 80%;
          }
        }
      }
    }
  }
  .customerService-wrap,
  .liveRoomInfo-wrap {
    height: 100%;
    height: 300px;
    color: white;
  }
  .customerService-wrap {
    position: relative;
    text-align: center;
    .qrcode {
      display: block;
      margin: 0 auto 10px;
      width: 200px;
      height: 200px;
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
    padding: 0;
    width: 100%;
    height: 40px;
    background-color: white;
    .emoji-list {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      overflow: scroll;
      box-sizing: border-box;
      padding-top: 5px;
      padding-left: 5px;
      height: 160px;
      background-color: #fff;
      transform: translateY(-100%);

      @extend %customScrollbar;
      .item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 8vw;
        height: 8vw;
        border: 1px solid #f8f8f8;
        font-size: 20px;
      }
    }
    .face {
      width: 20px;
      height: 20px;

      @include setBackground('@/assets/img/msg-face.webp');
    }
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
