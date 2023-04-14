<template>
  <div class="push-wrap">
    <div class="left">
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
          :muted="muted"
          controls
        ></video>
        <div
          v-if="currMediaTypeList.length <= 0"
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
      <div class="control">
        <div class="info">
          <div class="avatar"></div>
          <div class="detail">
            <div class="top">
              <!-- <button @click="addTrack">addTrack</button> -->
              <!-- <button @click="handleMedia">handleMedia</button> -->
              <input
                ref="roomNameRef"
                v-model="roomName"
                type="text"
                placeholder="输入房间名"
              />
              <button
                class="btn"
                @click="confirmRoomName"
              >
                确定
              </button>
              <button
                class="btn"
                @click="cancelRoomName"
              >
                取消
              </button>
              <!-- 房东的猫livehouse/音乐节 -->
            </div>
            <div class="bottom">
              <span>socketId：{{ getSocketId() }}</span>
              <div>
                rtcStatus：{{ networkStore.getRtcMap(roomId)?.rtcStatus }}
              </div>
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <span class="item">
              <i class="ico"></i>
              <span>在线人数：10</span>
            </span>
          </div>
          <div class="bottom">
            <!-- <button @click="batchSendOffer">batchSendOffer</button> -->
            <button @click="startLive">startLive</button>
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
            <span class="name">{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="danmu-card">
        <div class="title">弹幕互动</div>
        <div class="list">
          <div
            v-for="(item, index) in damuList"
            :key="index"
            class="item"
          >
            <span class="name">{{ item.nickname }}：</span>
            <span class="msg">{{ item.msg }}</span>
          </div>
        </div>

        <div class="send-msg">
          <input class="ipt" />
          <div class="btn">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString } from 'billd-utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { IAdminIn, ICandidate, IOffer, liveTypeEnum } from '@/interface';
import { WebRTCClass } from '@/network/webRtc';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();
const route = useRoute();
const appStore = useAppStore();
const roomIdRef = ref<HTMLInputElement>();
const joinRef = ref<HTMLButtonElement>();
const leaveRef = ref<HTMLButtonElement>();
const defaultRoomId = getRandomString(15);
const roomId = ref<string>(defaultRoomId);
const roomName = ref('');
const roomNameRef = ref<HTMLInputElement>();
const websocketInstant = ref<WebSocketClass>();
const isDone = ref(false);
const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();
const localStream = ref();
const currMediaTypeList = ref<liveTypeEnum[]>([]);
const currMediaType = ref<liveTypeEnum>();
const id = ref('');
const joined = ref(false);
const isAdmin = ref(true);
const offerSended = ref(new Set());

const damuList = ref([
  { nickname: '鲜花', msgType: 1, msg: '423425' },
  // { nickname: '肥宅水', msgType: 1, msg: 'sdgdsgsg' },
  // { nickname: '小鸡腿', msgType: 1, msg: '63463gsd' },
  // { nickname: '大鸡腿', msgType: 1, msg: '46326fb26' },
  // { nickname: '一杯咖啡', msgType: 1, msg: 'shgd544' },
  // { nickname: 'sdsg', msgType: 1, msg: 'shgd544' },
  // { nickname: 'gdsg', msgType: 1, msg: 'we' },
  // { nickname: 'sgdx', msgType: 1, msg: 'shgd544' },
  // { nickname: 'gsdx', msgType: 1, msg: 'ew' },
  // { nickname: 'gs', msgType: 1, msg: 'etew' },
  // { nickname: 'gwe', msgType: 1, msg: 'shgd544' },
  // { nickname: 'tewtwe', msgType: 1, msg: 'shgd544' },
  // { nickname: 'hdfh', msgType: 1, msg: 'ew' },
  // { nickname: '534', msgType: 1, msg: 'etew' },
  // { nickname: '234232', msgType: 1, msg: 'shgd544' },
]);

const liveUserList = ref<
  {
    socketId: string;
    avatar: string;
    expr: number;
  }[]
>([]);

onMounted(() => {
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
    if (isAdmin.value) {
      batchSendOffer();
    }
  });
});

watch(
  () => appStore.liveStatus,
  (newVal) => {
    if (newVal) {
      console.log('开始直播');
      handleMedia();
    }
  }
);

function getSocketId() {
  return networkStore.wsMap.get(roomId.value!)?.socketIo?.id || '-1';
}

function sendJoin() {
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance) return;
  instance.send({
    msgType: WsMsgTypeEnum.join,
    data: {
      roomName: roomName.value,
    },
  });
}

function batchSendOffer() {
  liveUserList.value.forEach(async (item) => {
    if (
      !offerSended.value.has(item.socketId) &&
      item.socketId !== getSocketId()
    ) {
      await startNewWebRtc(item.socketId);
      await addTrack();
      console.warn('new WebRTCClass完成');
      console.log('执行sendOffer', {
        sender: getSocketId(),
        receiver: item.socketId,
      });
      sendOffer({ sender: getSocketId(), receiver: item.socketId });
      offerSended.value.add(item.socketId);
    }
  });
}

async function handleMedia() {
  if (isAdmin.value) {
    try {
      if (currMediaType.value === liveTypeEnum.camera) {
        await startMediaDevices();
      } else if (currMediaType.value === liveTypeEnum.screen) {
        await startGetDisplayMedia();
      }
    } catch (error) {
      console.log('用户拒绝', error);
    }
  }
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
  });

  // websocket连接断开
  instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
    console.log('【websocket】websocket连接断开', instance);
    if (!instance) return;
    instance.status = WsConnectStatusEnum.disconnect;
    instance.update();
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.adminIn, (data: IAdminIn) => {
    console.log('【websocket】收到管理员正在直播', data);
    if (isDone.value) return;
    // sendOffer({ sender: getSocketId(), receiver: data.socketId });
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.liveUser, () => {
    console.log('【websocket】当前所有在线用户');
    if (!instance) return;
  });

  // 收到offer
  instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
    console.warn('【websocket】收到offer', data);
    if (!instance) return;
    if (data.data.receiver === getSocketId()) {
      console.log('收到offer，这个offer是发给我的');
      const rtc = startNewWebRtc(data.data.sender);
      await rtc.setRemoteDescription(data.data.sdp);
      const sdp = await rtc.createAnswer();
      await rtc.setLocalDescription(sdp);
      websocketInstant.value?.send({
        msgType: WsMsgTypeEnum.answer,
        data: { sdp, sender: getSocketId(), receiver: data.data.sender },
      });
    } else {
      console.log('收到offer，但是这个offer不是发给我的');
    }
  });

  // 收到answer
  instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
    console.warn('【websocket】收到answer', data);
    if (isDone.value) return;
    if (!instance) return;
    const rtc = networkStore.getRtcMap(`${roomId.value}___${data.socketId}`);
    console.log(rtc, '收到answer收到answer');
    if (!rtc) return;
    rtc.rtcStatus.answer = true;
    rtc.update();
    if (data.data.receiver === getSocketId()) {
      console.log('收到answer，这个answer是发给我的');
      await rtc.setRemoteDescription(data.data.sdp);
    } else {
      console.log('收到answer，但这个answer不是发给我的');
    }
  });

  // 收到candidate
  instance.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
    console.warn('【websocket】收到candidate', data);
    if (isDone.value) return;
    if (!instance) return;
    const rtc =
      networkStore.getRtcMap(`${roomId.value}___${data.socketId}`) ||
      networkStore.getRtcMap(roomId.value);
    if (!rtc) return;
    if (data.socketId !== getSocketId()) {
      console.log('不是我发的candidate');
      const candidate = new RTCIceCandidate({
        sdpMid: data.data.sdpMid,
        sdpMLineIndex: data.data.sdpMLineIndex,
        candidate: data.data.candidate,
      });
      rtc.peerConnection
        ?.addIceCandidate(candidate)
        .then(() => {
          console.log('candidate成功');
          // rtc.handleStream();
        })
        .catch((err) => {
          console.error('candidate失败', err);
        });
    } else {
      console.log('是我发的candidate');
    }
  });

  // 用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.join, (data) => {
    console.log('【websocket】用户加入房间', data);
    if (!instance) return;
  });

  // 用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.joined, (data) => {
    console.log('【websocket】用户加入房间完成', data);
    joined.value = true;
    liveUserList.value.push({
      avatar: 'red',
      socketId: `${getSocketId()}`,
      expr: 1,
    });
    batchSendOffer();
  });

  // 其他用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
    console.log('【websocket】其他用户加入房间', data);
    liveUserList.value.push({
      avatar: 'red',
      socketId: data.socketId,
      expr: 1,
    });
    console.log('当前所有在线用户', JSON.stringify(liveUserList.value));
    console.log(isAdmin.value, joined.value);
    if (isAdmin.value && joined.value) {
      batchSendOffer();
    }
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
    if (!instance) return;
    const res = liveUserList.value.filter(
      (item) => item.socketId !== data.socketId
    );
    console.log('当前所有在线用户', JSON.stringify(res));
    liveUserList.value = res;
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

function cancelRoomName() {
  if (!roomNameRef.value) return;
  roomNameRef.value.disabled = false;
}

function startLive() {
  if (!roomNameIsOk()) return;
  if (!currMediaTypeList.value.length) {
    alert('请选择一个素材！');
    return;
  }
  id.value = route.query.id as string;
  websocketInstant.value = new WebSocketClass({
    roomId: roomId.value,
    url:
      process.env.NODE_ENV === 'development'
        ? 'ws://localhost:4300'
        : 'wss://live.hsslive.cn',
    isAdmin: isAdmin.value,
  });
  websocketInstant.value.update();
  initReceive();
  sendJoin();
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
    currMediaType.value = liveTypeEnum.camera;
    currMediaTypeList.value.push(liveTypeEnum.camera);
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
    console.log('getDisplayMedia成功', event);
    currMediaType.value = liveTypeEnum.screen;
    currMediaTypeList.value.push(liveTypeEnum.screen);
    if (!localVideoRef.value) return;
    localVideoRef.value.srcObject = event;
    localStream.value = event;
  }
}
function addTrack() {
  if (!localStream.value) return;
  liveUserList.value.forEach((item) => {
    if (item.socketId !== getSocketId()) {
      localStream.value.getTracks().forEach((track) => {
        const rtc = networkStore.getRtcMap(
          `${roomId.value}___${item.socketId}`
        );
        rtc?.addTrack(track, localStream.value);
      });
    }
  });
}

async function sendOffer({
  sender,
  receiver,
}: {
  sender: string;
  receiver: string;
}) {
  if (isDone.value) return;
  if (!websocketInstant.value) return;
  const rtc = networkStore.getRtcMap(`${roomId.value}___${receiver}`);
  if (!rtc) return;
  const sdp = await rtc.createOffer();
  await rtc.setLocalDescription(sdp);
  websocketInstant.value.send({
    msgType: WsMsgTypeEnum.offer,
    data: { sdp, sender, receiver },
  });
}

function startNewWebRtc(receiver: string) {
  console.warn('开始new WebRTCClass', receiver);
  const rtc = new WebRTCClass({ roomId: `${roomId.value}___${receiver}` });
  rtc.rtcStatus.joined = true;
  rtc.update();
  return rtc;
}

function leave() {
  if (joinRef.value && leaveRef.value && roomIdRef.value) {
    roomIdRef.value.disabled = false;
    joinRef.value.disabled = false;
    leaveRef.value.disabled = true;
  }
  if (!websocketInstant.value) return;
  websocketInstant.value.socketIo?.emit(WsMsgTypeEnum.leave, {
    roomId: websocketInstant.value.roomId,
  });
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
    box-sizing: border-box;
    width: $large-left-width;
    height: 100%;
    border: 1px solid red;
    border-radius: 10px;
    background-color: white;
    color: #9499a0;
    vertical-align: top;

    .video-wrap {
      // height: 100px;
      // height: 550px;
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
          background-color: rebeccapurple;
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
      background-color: pink;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: yellow;
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
      margin-bottom: 5%;
      margin-bottom: 10px;
      width: 100%;
      height: 290px;
      border-radius: 4px;
      background-color: pink;
      .title {
        padding: 10px;
        text-align: initial;
      }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
    .danmu-card {
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      height: 400px;
      border-radius: 4px;
      background-color: pink;
      text-align: initial;
      .title {
        margin-bottom: 10px;
      }
      .list {
        margin-bottom: 10px;
        height: 300px;
        .item {
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
          background-color: #23ade5;
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
  .push-wrap {
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
