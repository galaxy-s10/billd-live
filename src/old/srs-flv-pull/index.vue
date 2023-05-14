<template>
  <div class="srs-flv-pull-wrap">
    <template v-if="roomNoLive">当前房间没在直播~</template>
    <template v-else>
      <div class="left">
        <div
          ref="topRef"
          class="head"
        >
          <div class="info">
            <div class="avatar"></div>
            <div class="detail">
              <div class="top">房间名：{{ roomName }}</div>
              <div class="bottom">
                <span>你的socketId：{{ getSocketId() }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="video-wrap">
          <video
            id="localVideo"
            ref="localVideoRef"
            autoplay
            webkit-playsinline="true"
            playsinline
            x-webkit-airplay="allow"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            x5-video-orientation="portraint"
            :muted="appStore.muted"
          ></video>
          <div class="controls">
            <VideoControls></VideoControls>
          </div>
        </div>
        <div
          ref="bottomRef"
          class="gift"
        >
          <div
            v-for="(item, index) in giftList"
            :key="index"
            class="item"
          >
            <div class="ico"></div>
            <div class="name">{{ item.name }}</div>
            <div class="price">{{ item.price }}</div>
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
            v-for="(item, index) in liveUserList.filter((item) =>
              userStore.userInfo ? item.socketId !== getSocketId() : true
            )"
            :key="index"
            class="item"
          >
            <div class="info">
              <div class="avatar"></div>
              <div class="username">{{ item.socketId }}</div>
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
        <div class="danmu-list">
          <div
            v-for="(item, index) in damuList"
            :key="index"
            class="item"
          >
            <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
              <span class="name">
                {{ item.userInfo?.username || item.socketId }}：
              </span>
              <span class="msg">{{ item.msg }}</span>
            </template>
            <template v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin">
              <span class="name system">系统通知：</span>
              <span class="msg">
                {{ item.userInfo?.username || item.socketId }}进入直播！
              </span>
            </template>
            <template v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved">
              <span class="name system">系统通知：</span>
              <span class="msg">
                {{ item.userInfo?.username || item.socketId }}离开直播！
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

import { usePull } from '@/hooks/use-pull';
import { DanmuMsgTypeEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const appStore = useAppStore();

const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const localVideoRef = ref<HTMLVideoElement>();

const {
  initPull,
  closeWs,
  closeRtc,
  getSocketId,
  keydownDanmu,
  sendDanmu,
  roomName,
  roomNoLive,
  damuList,
  giftList,
  liveUserList,
  danmuStr,
} = usePull({ localVideoRef });

onUnmounted(() => {
  closeWs();
  closeRtc();
});

onMounted(() => {
  if (topRef.value && bottomRef.value && localVideoRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      (topRef.value.getBoundingClientRect().top +
        topRef.value.getBoundingClientRect().height);
    localVideoRef.value.style.height = `${res}px`;
  }
  initPull();
});
</script>

<style lang="scss" scoped>
.srs-flv-pull-wrap {
  margin: 20px auto 0;
  min-width: $large-width;
  height: 700px;
  text-align: center;
  .left {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: $large-left-width;
    height: 100%;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;
    vertical-align: top;
    overflow: hidden;
    .head {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background-color: papayawhip;
      .tag {
        display: inline-block;
        margin-right: 5px;
        padding: 1px 4px;
        border: 1px solid;
        border-radius: 2px;
        color: #9499a0;
        font-size: 12px;
      }

      .info {
        display: flex;
        align-items: center;
        text-align: initial;

        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: skyblue;
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
              background-color: skyblue;
            }
          }
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
    .video-wrap {
      position: relative;
      background-color: #18191c;
      #localVideo {
        max-width: 100%;
        max-height: 100%;
      }
      .controls {
        display: none;
      }
      &:hover {
        .controls {
          display: block;
        }
      }
    }
    .gift {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 100px;
      background-color: papayawhip;
      .item {
        margin-right: 10px;
        text-align: center;

        .ico {
          width: 50px;
          height: 50px;
          background-color: skyblue;
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
            background-color: skyblue;
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
        background-color: skyblue;
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
  .srs-flv-pull-wrap {
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
