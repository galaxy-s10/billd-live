<template>
  <div class="webrtc-push-wrap">
    <div
      ref="topRef"
      class="left"
    >
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
          muted
        ></video>
        <div
          v-if="!currMediaTypeList || currMediaTypeList.length <= 0"
          class="add-wrap"
        >
          <n-space>
            <n-button
              class="item"
              @click="startGetUserMedia"
            >
              摄像头
            </n-button>
            <n-button
              class="item"
              @click="startGetDisplayMedia"
            >
              窗口
            </n-button>
          </n-space>
        </div>
      </div>
      <div
        ref="bottomRef"
        class="control"
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
                  :disabled="disabled"
                />
                <n-button
                  size="small"
                  type="primary"
                  :disabled="disabled"
                  @click="confirmRoomName"
                >
                  确定
                </n-button>
              </n-input-group>
            </div>
            <div class="bottom">
              <span>socketId：{{ getSocketId() }}</span>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <span class="item">
              <i class="ico"></i>
              <span>正在观看人数：{{ liveUserList.length }}</span>
            </span>
          </div>
          <div class="bottom">
            <n-space>
              <n-button
                type="info"
                size="small"
                @click="startLive"
              >
                开始直播
              </n-button>
              <n-button
                type="info"
                size="small"
                @click="endLive"
              >
                结束直播
              </n-button>
            </n-space>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="resource-card">
        <div class="title">素材列表</div>
        <div class="list">
          <div
            v-for="(item, index) in currMediaTypeList"
            :key="index"
            class="item"
          >
            <span class="name">{{ item.txt }}</span>
          </div>
        </div>
      </div>
      <div class="danmu-card">
        <div class="title">弹幕互动</div>
        <div class="list-wrap">
          <div class="list">
            <div
              v-for="(item, index) in damuList"
              :key="index"
              class="item"
            >
              <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
                <span class="name">{{ item.socketId }}：</span>
                <span class="msg">{{ item.msg }}</span>
              </template>
              <template v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin">
                <span class="name system">系统通知：</span>
                <span class="msg">{{ item.socketId }}进入直播！</span>
              </template>
              <template
                v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved"
              >
                <span class="name system">系统通知：</span>
                <span class="msg">{{ item.socketId }}离开直播！</span>
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { usePush } from '@/hooks/use-push';
import { DanmuMsgTypeEnum, liveTypeEnum } from '@/interface';
import { useUserStore } from '@/store/user';

const route = useRoute();
const userStore = useUserStore();

const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const localVideoRef = ref<HTMLVideoElement>();
const liveType = route.query.liveType;

const {
  initPush,
  confirmRoomName,
  getSocketId,
  startGetDisplayMedia,
  startGetUserMedia,
  startLive,
  endLive,
  closeWs,
  closeRtc,
  sendDanmu,
  keydownDanmu,
  disabled,
  danmuStr,
  roomName,
  damuList,
  liveUserList,
  currMediaTypeList,
} = usePush({
  localVideoRef,
  isSRS: liveType === liveTypeEnum.srsPush,
});

onUnmounted(() => {
  closeWs();
  closeRtc();
});

onMounted(() => {
  initPush();
  if (topRef.value && bottomRef.value && localVideoRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      topRef.value.getBoundingClientRect().top;
    localVideoRef.value.style.height = `${res}px`;
  }
});
</script>

<style lang="scss" scoped>
.webrtc-push-wrap {
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
    overflow: hidden;
    background-color: white;
    color: #9499a0;
    vertical-align: top;

    .video-wrap {
      position: relative;
      background-color: #18191c;
      #localVideo {
        max-width: 100%;
        max-height: 100%;
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
        border-radius: 5px;
        background-color: white;
        transform: translate(-50%, -50%);
      }
    }
    .control {
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
          background-color: skyblue;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .detail {
          display: flex;
          flex-direction: column;
          text-align: initial;
          .top {
            margin-bottom: 10px;
            color: #18191c;
            .btn {
              margin-left: 10px;
            }
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
        margin-bottom: 10px;
        height: 300px;
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
  .webrtc-push-wrap {
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
