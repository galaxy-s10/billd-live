<template>
  <div class="home-wrap">
    <div class="left">
      <div class="head">
        <div class="info">
          <div class="avatar"></div>
          <div class="detail">
            <div class="top">
              <span class="tag">未开播</span>
              <!-- 房东的猫livehouse/音乐节 -->
              {{ networkStore.rtcMap.get(roomId)?.rtcStatus }}
            </div>
            <div class="bottom">
              <span class="tag">UP 3</span>
              up名字
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <span class="item">
              <i class="ico"></i>
              <span>直播间管理</span>
            </span>
            <span class="item">
              <i class="ico"></i>
              <span>1人看过</span>
            </span>
            <span class="item">
              <i class="ico"></i>
              <span>分享</span>
            </span>
          </div>
          <div class="bottom">关注量：5</div>
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
          :muted="muted"
          controls
        ></video>
      </div>
      <div class="gift">
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
        <span>大航海</span>
      </div>
      <div class="user-list">
        <div
          v-for="(item, index) in userList"
          :key="index"
          class="item"
        >
          <div class="info">
            <div class="avatar"></div>
            <div class="nickname">{{ item.nickname }}</div>
          </div>
          <div class="expr">{{ item.expr }}</div>
        </div>
      </div>
      <div class="msg-list">
        <div
          v-for="(item, index) in msgList"
          :key="index"
          class="item"
        >
          <span class="name">{{ item.nickname }}：</span>
          <span class="msg">{{ item.msg }}</span>
        </div>
      </div>
      <div class="send-msg">
        <textarea class="ipt"></textarea>
        <div class="btn">发送</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { liveTypeEnum } from '@/interface';
import { WebRTCClass } from '@/network/webRtc';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/network/webSocket';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();

const roomIdRef = ref<HTMLInputElement>();
const joinRef = ref<HTMLButtonElement>();
const leaveRef = ref<HTMLButtonElement>();
const roomId = ref<string>('19990507');
const websocketInstant = ref<WebSocketClass>();
// const userList = ref<{ id: string; rooms: string[] }[]>([]);
const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();
const localStream = ref();
const currType = ref(liveTypeEnum.screen); // 1:摄像头，2:录屏
const id = ref('');

const route = useRoute();
const appStore = useAppStore();
const isAdmin = ref(route.query.id === '1234');

const giftList = ref([
  { name: '鲜花', ico: '', price: '免费' },
  { name: '肥宅水', ico: '', price: '2元' },
  { name: '小鸡腿', ico: '', price: '3元' },
  { name: '大鸡腿', ico: '', price: '5元' },
  { name: '一杯咖啡', ico: '', price: '10元' },
]);
const msgList = ref([
  { nickname: '鲜花', msg: '423425' },
  { nickname: '肥宅水', msg: 'sdgdsgsg' },
  { nickname: '小鸡腿', msg: '63463gsd' },
  { nickname: '大鸡腿', msg: '46326fb26' },
  { nickname: '一杯咖啡', msg: 'shgd544' },
  { nickname: 'sdsg', msg: 'shgd544' },
  { nickname: 'gdsg', msg: 'we' },
  { nickname: 'sgdx', msg: 'shgd544' },
  { nickname: 'gsdx', msg: 'ew' },
  { nickname: 'gs', msg: 'etew' },
  { nickname: 'gwe', msg: 'shgd544' },
  { nickname: 'tewtwe', msg: 'shgd544' },
  { nickname: 'hdfh', msg: 'ew' },
  { nickname: '534', msg: 'etew' },
  { nickname: '234232', msg: 'shgd544' },
]);

const userList = ref([
  { nickname: '鲜花', avatar: '423425', expr: 100 },
  { nickname: '肥宅水', avatar: 'sdgdsgsg', expr: 100 },
  { nickname: '小鸡腿', avatar: '63463gsd', expr: 100 },
  { nickname: '大鸡腿', avatar: '46326fb26', expr: 100 },
  { nickname: '一杯咖啡', avatar: 'shgd544', expr: 100 },
]);

interface IOffer {
  socketId: string;
  roomId: string;
  data: {
    sdp: any;
  };
  isAdmin: boolean;
}

interface ICandidate {
  socketId: string;
  roomId: string;
  data: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  };
}

onMounted(() => {
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
  localVideoRef.value?.addEventListener('loadstart', () => {
    console.warn('视频流-loadstart');
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadstart = true;
    rtc.update();
  });

  localVideoRef.value?.addEventListener('loadedmetadata', async () => {
    console.warn('视频流-loadedmetadata');
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadedmetadata = true;
    rtc.update();
    if (isAdmin.value) {
      websocketInstant.value?.send({
        msgType: WsMsgTypeEnum.adminIn,
        data: {},
      });
      await sendOffer();
    }
  });
});

watch(
  () => appStore.liveStatus,
  (newVal) => {
    if (newVal) {
      console.log('开始直播');
      join();
    }
  }
);

function getSocketId() {
  return networkStore.wsMap.get(roomId.value!)?.socketIo?.id;
}

function sendJoin() {
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance) return;
  instance.send({ msgType: WsMsgTypeEnum.join, data: {} });
}

async function join() {
  console.log('join的房间号', roomId.value);
  if (!roomId.value) {
    console.error('房间号不能为空！');
    alert('房间号不能为空！');
    return;
  }

  if (isAdmin.value) {
    try {
      if (currType.value === liveTypeEnum.camera) {
        await startMediaDevices();
      } else if (currType.value === liveTypeEnum.screen) {
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
  instance.socketIo.on(WsMsgTypeEnum.adminIn, (data) => {
    console.log('【websocket】收到管理员正在直播', data);
    sendOffer();
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
    console.log('【websocket】当前所有在线用户');
    if (!instance) return;
    userList.value = data;
  });

  // 收到offer
  instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
    console.warn('【websocket】收到offer', data);
    if (!instance) return;
    if (data.socketId !== getSocketId()) {
      const rtc = networkStore.rtcMap.get(roomId.value);
      if (!rtc) return;
      console.log('收到offer，并且这个offer不是我发的', data);
      await rtc.setRemoteDescription(data.data.sdp);
      const sdp = await rtc.createAnswer();
      await rtc.setLocalDescription(sdp);
      websocketInstant.value?.send({
        msgType: WsMsgTypeEnum.answer,
        data: { sdp },
      });
    } else {
      console.log('收到offer，并且这个offer是我发的');
    }
  });

  // 收到answer
  instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
    console.warn('【websocket】收到answer', data);
    if (!instance) return;
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.answer = true;
    rtc.update();
    if (data.socketId !== getSocketId()) {
      console.log('不是我发的answer');
      await rtc.setRemoteDescription(data.data.sdp);
    } else {
      console.log('是我发的answer');
    }
  });

  // 收到candidate
  instance.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
    if (!instance) return;
    console.warn('【websocket】收到candidate', data);
    const rtc = networkStore.rtcMap.get(roomId.value);
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
    if (!instance) return;
    console.warn('开始new WebRTCClass');
    const rtc = new WebRTCClass({ roomId: roomId.value });
    rtc.rtcStatus.joined = true;
    rtc.update();
  });

  // 其他用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
    console.log('【websocket】其他用户加入房间', data);
    if (!instance) return;
    if (isAdmin.value) {
      sendOffer();
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
    instance.close();
  });
}

async function startMediaDevices() {
  currType.value = liveTypeEnum.camera;
  // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
  const event = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  console.log('getUserMedia成功', event);
  if (!localVideoRef.value) return;
  localVideoRef.value.srcObject = event;
  localStream.value = event;
  console.log('加轨1');
  localStream.value.getTracks().forEach((track) => {
    networkStore.rtcMap.get(roomId.value)?.addTrack(track, localStream.value);
  });
}

async function startGetDisplayMedia() {
  currType.value = liveTypeEnum.screen;
  // WARN navigator.mediaDevices.getDisplayMedia在localhost和https才能用，http://192.168.1.103:8000局域网用不了
  const event = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  console.log('getDisplayMedia成功', event);
  if (!localVideoRef.value) return;
  localVideoRef.value.srcObject = event;
  localStream.value = event;
  console.log('加轨2');
  localStream.value.getTracks().forEach((track) => {
    console.log(track, networkStore.rtcMap.get(roomId.value));
    networkStore.rtcMap.get(roomId.value)?.addTrack(track, localStream.value);
  });
}

async function sendOffer() {
  if (!websocketInstant.value) return;
  const rtc = networkStore.rtcMap.get(roomId.value);
  if (!rtc) return;
  if (isAdmin.value) {
    const sdp = await rtc.createOffer();
    await rtc.setLocalDescription(sdp);
    websocketInstant.value.send({
      msgType: WsMsgTypeEnum.offer,
      data: { sdp },
    });
  }
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
.home-wrap {
  display: flex;
  justify-content: space-between;
  margin: 20px auto 0;
  min-width: 1200px;
  width: 80%;
  .left {
    min-width: 1000px;
    border-radius: 10px;
    background-color: white;
    color: #9499a0;
    .head {
      display: flex;
      justify-content: space-between;
      padding: 20px;
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
        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: yellow;
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
      height: 500px;
      background-color: #18191c;
      #localVideo {
        width: 100%;
        height: 100%;
      }
    }
    .gift {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      background-color: white;
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
    box-sizing: border-box;
    min-width: 300px;
    border-radius: 10px;
    background-color: white;
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
          .nickname {
            color: black;
          }
        }
      }
    }
    .msg-list {
      overflow-y: scroll;
      padding: 0 15px;
      height: 350px;
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
        background-color: #23ade5;
        color: white;
        text-align: center;
        font-size: 12px;
      }
    }
  }
}
</style>
