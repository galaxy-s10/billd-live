<template>
  <div class="srs-webrtc-push-wrap">
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
          controls
        ></video>
        <div
          v-if="!currMediaTypeList || currMediaTypeList.length <= 0"
          class="add-wrap"
        >
          <div
            class="item"
            @click="startMediaDevices"
          >
            摄像头
          </div>
          <div
            class="item"
            @click="startGetDisplayMedia"
          >
            窗口
          </div>
        </div>
      </div>
      <div
        ref="bottomRef"
        class="control"
      >
        <div class="info">
          <div class="avatar"></div>
          <div class="detail">
            <div class="top">
              <input
                ref="roomNameRef"
                v-model="roomName"
                type="text"
                placeholder="输入房间名"
              />
              <button
                ref="roomNameBtnRef"
                class="btn"
                @click="confirmRoomName"
              >
                确定
              </button>
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
            <button @click="startLive">开始直播</button>
            <button @click="endLive">结束直播</button>
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
          />
          <div
            class="btn"
            @click="sendDanmu"
          >
            发送
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString } from 'billd-utils';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { fetchRtcV1Publish } from '@/api/srs';
import {
  DanmuMsgTypeEnum,
  IAdminIn,
  IDanmu,
  ILiveUser,
  LiveTypeEnum,
} from '@/interface';
import { SRSWebRTCClass } from '@/network/srsWebRtc';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/network/webSocket';
import router from '@/router';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();

const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const roomNameRef = ref<HTMLInputElement>();
const roomNameBtnRef = ref<HTMLButtonElement>();
const localVideoRef = ref<HTMLVideoElement>();

const roomId = ref<string>(getRandomString(15));
const danmuStr = ref('');
const roomName = ref('');
const localStream = ref();
const track = reactive({
  audio: true,
  video: true,
});
const streamurl = ref(
  `webrtc://${
    process.env.NODE_ENV === 'development' ? 'localhost' : 'live.hsslive.cn'
  }/live/livestream/${roomId.value}`
);
const flvurl = ref(
  `${
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5001'
      : 'https://live.hsslive.cn/srsflv'
  }/live/livestream/${roomId.value}.flv`
);

const websocketInstant = ref<WebSocketClass>();
const damuList = ref<IDanmu[]>([]);
const liveUserList = ref<ILiveUser[]>([]);

const allMediaTypeList = {
  [LiveTypeEnum.camera]: {
    type: LiveTypeEnum.camera,
    txt: '摄像头',
  },
  [LiveTypeEnum.screen]: {
    type: LiveTypeEnum.screen,
    txt: '窗口',
  },
};
const currMediaType = ref<{
  type: LiveTypeEnum;
  txt: string;
}>();
const currMediaTypeList = ref<
  {
    type: LiveTypeEnum;
    txt: string;
  }[]
>([]);

function handleCoverImg() {
  const canvas = document.createElement('canvas');
  const { width, height } = localVideoRef.value!.getBoundingClientRect();
  const rate = width / height;
  const coverWidth = width * 0.5;
  const coverHeight = coverWidth / rate;
  canvas.width = coverWidth;
  canvas.height = coverHeight;
  canvas
    .getContext('2d')!
    .drawImage(localVideoRef.value!, 0, 0, coverWidth, coverHeight);
  // webp比png的体积小非常多！因此coverWidth就可以不用压缩太夸张
  const dataURL = canvas.toDataURL('image/webp');
  return dataURL;
}

function closeWs() {
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance) return;
  instance.close();
}

function closeRtc() {
  networkStore.rtcMap.forEach((rtc) => {
    rtc.close();
  });
}

function sendDanmu() {
  if (!danmuStr.value.length) {
    alert('请输入弹幕内容！');
  }
  if (!websocketInstant.value) return;
  websocketInstant.value.send({
    msgType: WsMsgTypeEnum.message,
    data: { msg: danmuStr.value },
  });
  damuList.value.push({
    socketId: getSocketId(),
    msgType: DanmuMsgTypeEnum.danmu,
    msg: danmuStr.value,
  });
  danmuStr.value = '';
}

onUnmounted(() => {
  closeWs();
  closeRtc();
});

onMounted(() => {
  router.push({ query: { roomId: roomId.value } });
  if (topRef.value && bottomRef.value && localVideoRef.value) {
    const res =
      bottomRef.value.getBoundingClientRect().top -
      topRef.value.getBoundingClientRect().top;
    localVideoRef.value.style.height = `100px`;
    localVideoRef.value.style.height = `${res}px`;
  }
  localVideoRef.value?.addEventListener('loadstart', () => {
    console.warn('视频流-loadstart');
    const rtc = networkStore.getRtcMap(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadstart = true;
    rtc.update();
  });

  localVideoRef.value?.addEventListener('loadedmetadata', () => {
    console.warn('视频流-loadedmetadata');
    const rtc = networkStore.getRtcMap(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadedmetadata = true;
    rtc.update();
  });
});

function getSocketId() {
  return networkStore.wsMap.get(roomId.value!)?.socketIo?.id || '-1';
}

function initReceive() {
  const instance = websocketInstant.value;
  if (!instance?.socketIo) return;
  // websocket连接成功
  instance.socketIo.on(WsConnectStatusEnum.connect, () => {
    console.log('【websocket】websocket连接成功', instance.socketIo?.id);
    if (!instance) return;
    instance.status = WsConnectStatusEnum.connect;
    instance.update();
    sendJoin();
  });

  // websocket连接断开
  instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
    console.log('【websocket】websocket连接断开', instance);
    if (!instance) return;
    instance.status = WsConnectStatusEnum.disconnect;
    instance.update();
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.roomLiveing, (data: IAdminIn) => {
    console.log('【websocket】收到管理员正在直播', data);
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.liveUser, () => {
    console.log('【websocket】当前所有在线用户');
    if (!instance) return;
  });

  // 收到用户发送消息
  instance.socketIo.on(WsMsgTypeEnum.message, (data) => {
    console.log('【websocket】收到用户发送消息', data);
    if (!instance) return;
    damuList.value.push({
      socketId: data.socketId,
      msgType: DanmuMsgTypeEnum.danmu,
      msg: data.data.msg,
    });
  });

  // 用户加入房间完成
  instance.socketIo.on(WsMsgTypeEnum.joined, (data) => {
    console.log('【websocket】用户加入房间完成', data);
    liveUserList.value.push({
      avatar: 'red',
      socketId: `${getSocketId()}`,
      expr: 1,
    });
    handleSrsPush();
  });

  // 其他用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
    console.log('【websocket】其他用户加入房间', data);
    liveUserList.value.push({
      avatar: 'red',
      socketId: data.socketId,
      expr: 1,
    });
    damuList.value.push({
      socketId: data.socketId,
      msgType: DanmuMsgTypeEnum.otherJoin,
      msg: '',
    });
  });

  // 用户离开房间
  instance.socketIo.on(WsMsgTypeEnum.leave, (data) => {
    console.log('【websocket】用户离开房间', data);
    if (!instance) return;
    instance.socketIo?.emit(WsMsgTypeEnum.leave, {
      roomId: instance.roomId,
    });
  });

  // 用户离开房间完成
  instance.socketIo.on(WsMsgTypeEnum.leaved, (data) => {
    console.log('【websocket】用户离开房间完成', data);
    const res = liveUserList.value.filter(
      (item) => item.socketId !== data.socketId
    );
    liveUserList.value = res;
    damuList.value.push({
      socketId: data.socketId,
      msgType: DanmuMsgTypeEnum.userLeaved,
      msg: '',
    });
  });
}

function roomNameIsOk() {
  if (!roomName.value.length) {
    alert('请输入房间名！');
    return false;
  }
  if (roomName.value.length < 3 || roomName.value.length > 10) {
    alert('房间名要求3-10个字符！');
    return false;
  }
  return true;
}

function confirmRoomName() {
  if (!roomNameIsOk()) return;
  if (!roomNameRef.value) return;
  roomNameRef.value.disabled = true;
}

/** 结束直播 */
function endLive() {
  roomNameBtnRef.value!.disabled = false;
  closeRtc();
  currMediaTypeList.value = [];
  localStream.value = null;
  localVideoRef.value!.srcObject = null;
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance) return;
  instance.send({
    msgType: WsMsgTypeEnum.roomNoLive,
    data: {},
  });
  setTimeout(() => {
    instance.close();
  }, 500);
}

function sendJoin() {
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance) return;
  instance.send({
    msgType: WsMsgTypeEnum.join,
    data: {
      roomName: roomName.value,
      coverImg: handleCoverImg(),
      srs: {
        streamurl: streamurl.value,
        flvurl: flvurl.value,
      },
      track,
    },
  });
}

function startLive() {
  if (!roomNameIsOk()) return;
  if (currMediaTypeList.value.length <= 0) {
    alert('请选择一个素材！');
    return;
  }
  roomNameBtnRef.value!.disabled = true;
  websocketInstant.value = new WebSocketClass({
    roomId: roomId.value,
    url:
      process.env.NODE_ENV === 'development'
        ? 'ws://localhost:4300'
        : 'wss://live.hsslive.cn',
    isAdmin: true,
  });
  websocketInstant.value.update();
  initReceive();
}

async function handleSrsPush() {
  const rtc = new SRSWebRTCClass({
    roomId: `${roomId.value}___${getSocketId()}`,
  });
  localStream.value.getTracks().forEach((track) => {
    rtc.addTrack({ track, stream: localStream.value, direction: 'sendonly' });
  });
  try {
    const offer = await rtc.createOffer();
    if (!offer) return;
    await rtc.setLocalDescription(offer);
    const res: any = await fetchRtcV1Publish({
      api: `${
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:1985'
          : 'https://live.hsslive.cn/srs'
      }/rtc/v1/publish/`,
      clientip: null,
      sdp: offer.sdp!,
      streamurl: streamurl.value,
      tid: getRandomString(10),
    });
    await rtc.setRemoteDescription(
      new RTCSessionDescription({ type: 'answer', sdp: res.sdp })
    );
  } catch (error) {
    console.log(error);
  }
}

/** 摄像头 */
async function startMediaDevices() {
  if (!localStream.value) {
    // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
    const event = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    console.log('getUserMedia成功', event);
    currMediaType.value = allMediaTypeList[LiveTypeEnum.camera];
    currMediaTypeList.value.push(allMediaTypeList[LiveTypeEnum.camera]);
    if (!localVideoRef.value) return;
    localVideoRef.value.srcObject = event;
    localStream.value = event;
  }
}

/** 窗口 */
async function startGetDisplayMedia() {
  if (!localStream.value) {
    // WARN navigator.mediaDevices.getDisplayMedia在localhost和https才能用，http://192.168.1.103:8000局域网用不了
    const event = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    const audio = event.getAudioTracks();
    const video = event.getVideoTracks();
    track.audio = !!audio.length;
    track.video = !!video.length;
    console.log('getDisplayMedia成功', event);
    currMediaType.value = allMediaTypeList[LiveTypeEnum.screen];
    currMediaTypeList.value.push(allMediaTypeList[LiveTypeEnum.screen]);
    if (!localVideoRef.value) return;
    localVideoRef.value.srcObject = event;
    localStream.value = event;
  }
}
</script>

<style lang="scss" scoped>
.srs-webrtc-push-wrap {
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
    border-radius: 10px;
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
        width: 200px;
        height: 50px;
        background-color: #fff;
        transform: translate(-50%, -50%);
        .item {
          width: 60px;
          height: 30px;
          border-radius: 4px;
          background-color: skyblue;
          color: white;
          font-size: 14px;
          line-height: 30px;
          cursor: pointer;
        }
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
    border-radius: 10px;
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
      border-radius: 4px;
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
        .btn {
          box-sizing: border-box;
          width: 80px;
          height: 30px;
          border-radius: 4px;
          background-color: skyblue;
          color: white;
          text-align: center;
          font-size: 12px;
          line-height: 30px;
          cursor: pointer;
        }
      }
    }
  }
}
// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .srs-webrtc-push-wrap {
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
