<template>
  <div class="pull-wrap">
    <template v-if="roomNoLive">当前房间没在直播~</template>
    <template v-else>
      <div class="left">
        <div
          ref="topRef"
          class="head"
        >
          <div class="info">
            <div
              class="avatar"
              :style="{
                backgroundImage: `url(${liveRoomInfo?.user?.avatar})`,
              }"
            ></div>
            <div class="detail">
              <div class="top">{{ liveRoomInfo?.user?.username }}</div>
              <div class="bottom">
                <span>{{ liveRoomInfo?.live_room?.name }}</span>
                <span v-if="NODE_ENV === 'development'">
                  socketId:{{ getSocketId() }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          ref="containerRef"
          class="container"
          :style="{ height: height + 'px' }"
        >
          <div
            v-loading="videoLoading"
            class="video-wrap"
          >
            <div
              class="cover"
              :style="{
                backgroundImage: `url(${
                  liveRoomInfo?.live_room?.cover_img ||
                  liveRoomInfo?.user?.avatar
                })`,
              }"
            ></div>
            <!-- <div ref="canvasRef"></div> -->
            <div
              ref="canvasRef"
              class="media-list"
              :class="{ item: appStore.allTrack.length > 1 }"
              :style="{ height: height + 'px' }"
            ></div>
            <AudioRoomTip></AudioRoomTip>
            <VideoControls></VideoControls>
          </div>

          <div
            v-if="showSidebar"
            class="sidebar"
          >
            <div
              v-for="(item, index) in sidebarList"
              :key="index"
              class="item"
              :socketId="item.socketId"
            >
              <!-- x-webkit-airplay这个属性应该是使此视频支持ios的AirPlay功能 -->
              <!-- playsinline、 webkit-playsinline IOS微信浏览器支持小窗内播放 -->
              <!-- x5-video-player-type 启用H5播放器，是wechat安卓版特性 -->
              <!-- x5-video-player-fullscreen 全屏设置 -->
              <!-- x5-video-orientation 声明播放器支持的方向，可选值landscape横屏，portraint竖屏。默认值portraint。 -->
              <video
                :ref="(el) => (localVideoRef[item.socketId] = el)"
                autoplay
                webkit-playsinline="true"
                playsinline
                x-webkit-airplay="allow"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                x5-video-orientation="portraint"
                muted
              ></video>
              <div class="name">{{ item.socketId }}</div>
            </div>

            <div
              v-if="showJoin"
              class="join"
              @click="handleJoin()"
            >
              加入
            </div>
          </div>
        </div>

        <div
          ref="bottomRef"
          v-loading="giftLoading"
          class="gift-list"
        >
          <div
            v-for="(item, index) in giftGoodsList"
            :key="index"
            class="item"
          >
            <div
              class="ico"
              :style="{ backgroundImage: `url(${item.cover})` }"
            >
              <div
                v-if="item.badge"
                class="badge"
                :style="{ backgroundColor: item.badge_bg }"
              >
                <span class="txt">{{ item.badge }}</span>
              </div>
            </div>
            <div class="name">{{ item.name }}</div>
            <div class="price">￥{{ item.price }}</div>
          </div>
          <div
            class="item"
            @click="handleRecharge"
          >
            <div class="ico wallet"></div>
            <div class="name">
              余额:{{ userStore.userInfo?.wallet?.balance }}
            </div>
            <div class="price">立即充值</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="tab">
          <span>在线用户</span>
          <span> | </span>
          <span>排行榜</span>
        </div>
        <div class="user-list">
          <div
            v-for="(item, index) in liveUserList.filter(
              (item) => item.id !== getSocketId()
            )"
            :key="index"
            class="item"
          >
            <div class="info">
              <div
                class="avatar"
                :style="{ backgroundImage: `url(${item.userInfo?.avatar})` }"
              ></div>
              <div class="username">
                {{ item.userInfo?.username || item.id }}
              </div>
            </div>
          </div>
          <div
            v-if="userStore.userInfo"
            class="item"
          >
            <div class="info">
              <img
                :src="userStore.userInfo.avatar"
                class="avatar"
                alt=""
              />
              <div class="username">{{ userStore.userInfo.username }}</div>
            </div>
          </div>
        </div>
        <div
          ref="danmuListRef"
          class="danmu-list"
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
        <div class="send-msg">
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
      </div>
      <RechargeCpt v-if="showRecharge"></RechargeCpt>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { NODE_ENV } from 'script/constant';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsList } from '@/api/goods';
import { loginTip } from '@/hooks/use-login';
import { usePull } from '@/hooks/use-pull';
import {
  DanmuMsgTypeEnum,
  GoodsTypeEnum,
  IGoods,
  liveTypeEnum,
} from '@/interface';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

import RechargeCpt from './recharge/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();

const giftGoodsList = ref<IGoods[]>([]);
const height = ref(0);
const giftLoading = ref(false);
const showRecharge = ref(false);
const showJoin = ref(true);
const showSidebar = ref(true);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const localVideoRef = ref<HTMLVideoElement[]>([]);
const {
  initPull,
  closeWs,
  closeRtc,
  getSocketId,
  keydownDanmu,
  sendDanmu,
  addVideo,
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
  liveType: route.query.liveType as liveTypeEnum,
  isSRS: route.query.liveType === liveTypeEnum.srsWebrtcPull,
});

async function getGoodsList() {
  try {
    giftLoading.value = true;
    const res = await fetchGoodsList({
      type: GoodsTypeEnum.gift,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      giftGoodsList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    giftLoading.value = false;
  }
}

function handleRecharge() {
  if (!loginTip()) return;
  showRecharge.value = !showRecharge.value;
}

function handleJoin() {
  window.$message.info('维护中~');
  return;
  showJoin.value = !showJoin.value;
  nextTick(() => {
    addVideo();
  });
}

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

onUnmounted(() => {
  closeWs();
  closeRtc();
});

onMounted(() => {
  getGoodsList();
  if (
    [
      liveTypeEnum.srsHlsPull,
      liveTypeEnum.srsFlvPull,
      liveTypeEnum.srsWebrtcPull,
    ].includes(route.query.liveType as liveTypeEnum)
  ) {
    showSidebar.value = false;
  }
  if (topRef.value && bottomRef.value && containerRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      (topRef.value.getBoundingClientRect().top +
        topRef.value.getBoundingClientRect().height);
    height.value = res;
  }
  initPull();
});
</script>

<style lang="scss" scoped>
.pull-wrap {
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
    background-color: papayawhip;
    color: #9499a0;
    vertical-align: top;
    .head {
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;

      .info {
        display: flex;
        align-items: center;
        text-align: initial;

        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;

          @extend %containBg;
        }
        .detail {
          .top {
            margin-bottom: 10px;
            color: #18191c;
          }
          .bottom {
            font-size: 14px;
          }
        }
      }
      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        .top {
          display: flex;
          align-items: center;
          .item {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .ico {
              display: inline-block;
              margin-right: 4px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }
          }
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .video-wrap {
        position: relative;
        overflow: hidden;
        flex: 1;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.5);
        .cover {
          position: absolute;
          background-position: center center;
          background-size: cover;
          filter: blur(10px);

          inset: 0;
        }
        .media-list {
          overflow-y: scroll;
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

        .controls {
          display: none;
        }
        .tip-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 1;
          align-items: center;
          padding: 12px 26px;
          border: 2px solid rgba($color: papayawhip, $alpha: 0.5);
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.3);
          color: $theme-color-gold;
          cursor: pointer;
          transform: translate(-50%, -50%);
          &:hover {
            background-color: rgba($color: papayawhip, $alpha: 0.5);
            color: white;
          }
        }
      }
      .sidebar {
        overflow: scroll;
        width: 120px;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.3);

        @extend %hideScrollbar;
        .join {
          color: white;
          cursor: pointer;
        }
        video {
          max-width: 100%;
        }
        .name {
          word-wrap: break-word;
        }
      }
    }

    .gift-list {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-sizing: border-box;
      height: 120px;
      .item {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        width: 110px;
        height: 110px;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #ebe0ce;
        }
        .ico {
          position: relative;
          width: 50px;
          height: 50px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          &.wallet {
            background-image: url('@/assets/img/wallet.webp');
          }
          .badge {
            position: absolute;
            top: -8px;
            right: -10px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
            border-radius: 2px;
            color: white;
            .txt {
              display: inline-block;
              line-height: 1;
              transform-origin: center !important;

              @include minFont(10);
            }
          }
        }
        .name {
          color: #18191c;
          font-size: 12px;
        }
        .price {
          color: #9499a0;
          font-size: 12px;
        }
      }
    }
  }
  .right {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    margin-left: 10px;
    min-width: 300px;
    height: 100%;
    border-radius: 6px;
    background-color: papayawhip;
    color: #9499a0;
    .tab {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 5px 0;
      font-size: 12px;
    }
    .user-list {
      overflow-y: scroll;
      padding: 0 15px;
      height: 100px;
      background-color: papayawhip;

      @extend %hideScrollbar;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 12px;
        .info {
          display: flex;
          align-items: center;
          .avatar {
            margin-right: 5px;
            width: 25px;
            height: 25px;
            border-radius: 50%;

            @extend %containBg;
          }
          .username {
            color: black;
          }
        }
      }
    }
    .danmu-list {
      overflow-y: scroll;
      padding: 0 15px;
      height: 450px;
      text-align: initial;

      @extend %hideScrollbar;
      .item {
        margin-bottom: 10px;
        font-size: 12px;
        .name {
          color: #9499a0;
          &.system {
            color: red;
          }
        }
        .msg {
          color: #61666d;
        }
      }
    }
    .send-msg {
      position: absolute;
      bottom: 15px;
      box-sizing: border-box;
      padding: 0 10px;
      width: 100%;
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
        padding: 5px;
        width: 80px;
        border-radius: 4px;
        background-color: $theme-color-gold;
        color: white;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
    }
  }
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .pull-wrap {
    .left {
      width: $medium-left-width;
    }
    .right {
      .list {
        .item {
          width: 150px;
          height: 80px;
        }
      }
    }
  }
}
</style>
