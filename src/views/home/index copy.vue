<template>
  <div class="home-wrap">
    <div>
      <div class="content">
        <div class="left">
          房间号：<input
            ref="roomIdRef"
            v-model="roomId"
            type="text"
            placeholder="输入房间号"
          />
          <button
            ref="joinRef"
            class="join-btn"
            @click="join"
          >
            进入
          </button>
          <button
            ref="leaveRef"
            class="join-btn"
            disabled
            @click="leave"
          >
            退出
          </button>
          <div>socketId：{{ getSocketId() }}</div>
          <div>ws状态：{{ networkStore.wsMap.get(roomId!)?.status }}</div>
          <div>
            rtcStatus：{{ networkStore.rtcMap.get(roomId!)?.rtcStatus }}
          </div>
          <button @click="muted = !muted">静音{{ muted ? '开' : '关' }}</button>
          <div v-if="id === '1234'">
            选择类型：
            <button
              :style="{
                'margin-right': '10px',
                background: currType === 1 ? 'skyblue' : 'inherit',
              }"
              @click="currType = 1"
            >
              摄像头
            </button>
            <button
              :style="{
                background: currType === 2 ? 'skyblue' : 'inherit',
              }"
              @click="currType = 2"
            >
              录屏
            </button>
          </div>

          <div>
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
            ></video>
          </div>
        </div>

        <div class="right">
          <div>当前在线用户：</div>
          <ul>
            <li
              v-for="(item, index) in userList"
              :key="index"
            >
              {{ item.id }}
              <!-- <button
              v-if="item !== getSocketId()"
              @click="sendOffer"
            >
              开始视频
            </button> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { WebRTCClass } from '@/network/webRtc';
import {
  WebSocketClass,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  WsStatusEnum,
} from '@/network/webSocket';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();

const roomIdRef = ref<HTMLInputElement>();
const joinRef = ref<HTMLButtonElement>();
const leaveRef = ref<HTMLButtonElement>();
const roomId = ref<string>('19990507');
const websocketInstant = ref<WebSocketClass>();
const userList = ref<{ id: string; rooms: string[] }[]>([]);
const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();
const localStream = ref();
const currType = ref(1); // 1:摄像头，2:录屏
const id = ref('');
const route = useRoute();

interface IOffer {
  socketId: string;
  roomId: string;
  sdp: any;
}

interface ICandidate {
  socketId: string;
  roomId: string;
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

onMounted(() => {
  id.value = route.query.id as string;
  websocketInstant.value = new WebSocketClass({
    roomId: roomId.value,
    url:
      process.env.NODE_ENV === 'development'
        ? 'ws://localhost:4300'
        : 'wss://live.hsslive.cn',
  });
  websocketInstant.value.update();
  initReceive();

  localVideoRef.value?.addEventListener('loadstart', () => {
    console.warn('视频流-loadstart');
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadstart = true;
    rtc.update();
  });
  localVideoRef.value?.addEventListener('loadedmetadata', () => {
    console.warn('视频流-loadedmetadata');
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    rtc.rtcStatus.loadedmetadata = true;
    rtc.update();
  });
});
function getSocketId() {
  return networkStore.wsMap.get(roomId.value!)?.socketIo?.id;
}
function join() {
  console.log('join的房间号', roomId.value);
  if (!roomId.value) {
    console.error('房间号不能为空！');
    alert('房间号不能为空！');
    return;
  }
  if (joinRef.value && leaveRef.value && roomIdRef.value) {
    roomIdRef.value.disabled = true;
    joinRef.value.disabled = true;
    leaveRef.value.disabled = false;
  }
  const instance = networkStore.wsMap.get(roomId.value);
  if (!instance?.socketIo) return;
  instance.socketIo.emit(WsMsgTypeEnum.join, {
    roomId: instance.roomId,
  });
  if (id.value === '1234') {
    if (currType.value === 1) {
      startMediaDevices();
    } else if (currType.value === 2) {
      startGetDisplayMedia();
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
    instance.status = WsStatusEnum.connect;
    instance.update();
  });

  // 当前所有在线用户
  instance.socketIo.on(WsMsgTypeEnum.liveUser, (data) => {
    console.log('【websocket】当前所有在线用户');
    if (!instance) return;
    userList.value = data;
  });

  // websocket连接断开
  instance.socketIo.on(WsConnectStatusEnum.disconnect, () => {
    console.log('【websocket】websocket连接断开', instance);
    if (!instance) return;
    instance.status = WsStatusEnum.disconnect;
    instance.update();
  });

  // 收到offer
  instance.socketIo.on(WsMsgTypeEnum.offer, async (data: IOffer) => {
    console.warn('【websocket】收到offer', data);
    if (!instance) return;
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (data.socketId !== getSocketId()) {
      console.log('收到offer，并且这个offer不是我发的', data);

      setTimeout(async () => {
        await rtc?.setRemoteDescription(data.sdp);
        const sdp = await rtc?.createAnswer();
        instance.socketIo?.emit(WsMsgTypeEnum.answer, {
          socketId: getSocketId(),
          roomId: roomId.value,
          sdp,
        });
      }, 500);
    } else {
      console.log('收到offer，并且这个offer是我发的');
    }
  });

  // 收到answer
  instance.socketIo.on(WsMsgTypeEnum.answer, async (data: IOffer) => {
    console.warn('【websocket】收到answer', data);
    if (!instance) return;
    if (!networkStore.rtcMap.get(roomId.value)?.rtcStatus.createOffer) return;
    if (data.socketId !== getSocketId()) {
      console.log('不是我发的answer');
      await networkStore.rtcMap
        .get(roomId.value)
        ?.setRemoteDescription(data.sdp);
      // sendAnswer(networkStore.rtcMap.get(roomId.value)?.localDescription);
    } else {
      console.log('是我发的answer');
      // sendAnswer(data.sdp);
    }
  });

  // 收到candidate
  instance.socketIo.on(WsMsgTypeEnum.candidate, (data: ICandidate) => {
    console.warn('【websocket】收到candidate', data);
    if (!instance) return;
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (!rtc) return;
    if (data.socketId !== getSocketId()) {
      console.log('不是我发的candidate');
      setTimeout(() => {
        console.log(data.sdpMid, data.sdpMLineIndex, 888888);
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: data.sdpMLineIndex,
          candidate: data.candidate,
        });
        rtc.peerConnection
          ?.addIceCandidate(candidate)
          .then(() => {
            console.log('candidate成功');
            rtc.rtcStatus.icecandidate = true;
            rtc.update();
          })
          .catch((err) => {
            console.error('candidate失败', err);
          });
      }, 1000);
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
    // if (userList.value.length > 1) {
    //   sendOffer();
    // }
  });

  // 其他用户加入房间
  instance.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
    console.log('【websocket】其他用户加入房间', data);
    if (!instance) return;
    console.log('加轨');
    // sendAnswer(networkStore.rtcMap.get(roomId.value)?.localDescription);
    // localStream.value.getTracks().forEach((track) => {
    //   networkStore.rtcMap
    //     .get(roomId.value)
    //     ?.myAddTrack(track, localStream.value);
    // });
    sendOffer();
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

function startMediaDevices() {
  currType.value = 1;
  // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((event) => {
      console.log('getUserMedia成功', event);
      if (!localVideoRef.value) return;
      localVideoRef.value.srcObject = event;
      localStream.value = event;
      localStream.value.getTracks().forEach((track) => {
        networkStore.rtcMap
          .get(roomId.value)
          ?.myAddTrack(track, localStream.value);
      });
    })
    .catch((err) => {
      console.log('getUserMedia失败', err);
    });
}

function startGetDisplayMedia() {
  currType.value = 2;
  // WARN navigator.mediaDevices.getDisplayMedia在localhost和https才能用，http://192.168.1.103:8000局域网用不了
  navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true })
    .then((event) => {
      console.log('getDisplayMedia成功', event);
      if (!localVideoRef.value) return;
      localVideoRef.value.srcObject = event;
      localStream.value = event;
      localStream.value.getTracks().forEach((track) => {
        networkStore.rtcMap
          .get(roomId.value)
          ?.myAddTrack(track, localStream.value);
      });
    })
    .catch((err) => {
      console.log('getDisplayMedia失败', err);
    });
}

async function sendOffer() {
  if (!websocketInstant.value) return;
  const localDesc = await networkStore.rtcMap.get(roomId.value)?.createOffer();
  console.log('sendOffer', localDesc);

  const data = {
    socketId: getSocketId(),
    roomId: roomId.value,
    sdp: localDesc,
  };
  console.warn('【websocket】发送offer', data);
  websocketInstant.value.socketIo?.emit(WsMsgTypeEnum.offer, data);
}
// async function sendAnswer(sdp) {
//   if (!websocketInstant.value) return;
//   console.warn('发送answer');
//   const createOffer = await networkStore.rtcMap.get(roomId.value)?.rtcStatus
//     .createOffer;
//   if (!createOffer) {
//     await networkStore.rtcMap.get(roomId.value)?.createOffer();
//   }
//   websocketInstant.value.socketIo?.emit(WsMsgTypeEnum.answer, {
//     socketId: getSocketId(),
//     roomId: roomId.value,
//     sdp,
//   });
// }

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
  padding: 10px;
  background-color: skyblue;
  video {
    width: 800px;
    background-color: pink;
  }
  .content {
    display: flex;
    .left {
      margin-right: 50px;
      .join-btn {
        margin-left: 10px;
      }
    }
    .right {
    }
  }
}
</style>
