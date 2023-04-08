<template>
  <div class="home-wrap">
    <div>
      需求：
      <div>1.房主的话，直接调用摄像头然后展示画面</div>
      <div>
        1.用户a进来了，默认不显示用户a的画面，用户a直接new
        rtc，然后将自己的sdp房主，房主给他的rtc添加音视频轨，让用户a能看到房主的画面
      </div>
    </div>
    <br />
    <div class="content">
      <div class="left">
        房间号：<input
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
        <div>rtcStatus：{{ networkStore.rtcMap.get(roomId!)?.rtcStatus }}</div>
        <button @click="startAction">开始直播</button>
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
            controls
          ></video>
        </div>
      </div>
      <div class="right">
        <div>当前房间用户：</div>
        <ul>
          <li
            v-for="item in userList"
            :key="item"
          >
            {{ item }}
            <button
              v-if="item !== getSocketId()"
              @click="sendOffer"
            >
              开始视频
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { WebRTCClass } from '@/network/webRtc';
import {
  WebSocketClass,
  statusEnum,
  wsConnectStatus,
  wsMsgType,
} from '@/network/webSocket';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();

const joinRef = ref<HTMLButtonElement>();
const leaveRef = ref<HTMLButtonElement>();
const roomId = ref<string>('123456');
const instance = ref<WebSocketClass>();
const userList = ref<string[]>([]);
const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();
const localStream = ref();

function getSocketId() {
  return networkStore.wsMap.get(roomId.value!)?.socketIo?.id;
}

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
  localVideoRef.value?.addEventListener('loadstart', () => {
    console.warn('视频流-loadstart');
  });
  localVideoRef.value?.addEventListener('loadedmetadata', () => {
    console.warn('视频流-loadedmetadata');
  });
});

// Handles start button action: creates local MediaStream.
function startAction() {
  // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((event) => {
      console.log('getUserMedia成功', event);
      if (!localVideoRef.value) return;
      localVideoRef.value.srcObject = event;
      localStream.value = event;
      // event.getTracks().forEach((track) => {
      //   console.log('tracktrack', track, event);
      //   networkStore.rtcMap.get(roomId.value)?.myAddTrack(track, event);
      // });
    })
    .catch((err) => {
      console.log('getUserMedia失败', err);
    });
}
async function sendOffer() {
  if (!instance.value) return;
  const localDesc = await networkStore.rtcMap.get(roomId.value)?.createOffer();
  console.warn('发送offer');
  instance.value.socketIo?.emit(wsMsgType.offer, {
    socketId: getSocketId(),
    roomId: roomId.value,
    sdp: localDesc,
  });
}
async function sendAnswer(sdp) {
  if (!instance.value) return;
  console.warn('发送answer');
  const createOffer = await networkStore.rtcMap.get(roomId.value)?.rtcStatus
    .createOffer;
  if (!createOffer) {
    await networkStore.rtcMap.get(roomId.value)?.createOffer();
  }
  instance.value.socketIo?.emit(wsMsgType.answer, {
    socketId: getSocketId(),
    roomId: roomId.value,
    sdp,
  });
}

function join() {
  console.log('join的房间号', roomId.value);
  if (!roomId.value) {
    console.error('房间号不能为空！');
    return;
  }
  instance.value = new WebSocketClass({
    roomId: roomId.value,
    url: 'ws://localhost:4300',
  });

  if (!instance.value.socketIo) return;
  // websocket连接成功
  instance.value.socketIo.on(wsConnectStatus.connect, () => {
    if (!instance.value) return;
    console.log('【websocket】websocket连接成功', instance.value.socketIo?.id);
    if (!instance.value) return;
    instance.value.status = statusEnum.connect;
    if (joinRef.value && leaveRef.value) {
      joinRef.value.disabled = true;
      leaveRef.value.disabled = false;
    }
    instance.value.update();
    instance.value.socketIo?.emit(wsMsgType.join, {
      roomId: instance.value.roomId,
    });
  });

  // websocket连接断开
  instance.value.socketIo.on(wsConnectStatus.disconnect, () => {
    console.log('【websocket】websocket连接断开', instance.value);
    if (!instance.value) return;
    instance.value.status = statusEnum.disconnect;
    instance.value.update();
  });

  // 收到offer
  instance.value.socketIo.on(wsMsgType.offer, async (data: IOffer) => {
    console.warn('【websocket】收到offer', data);
    if (!instance.value) return;
    const rtc = networkStore.rtcMap.get(roomId.value);
    if (data.socketId !== getSocketId()) {
      console.log('收到offer，并且这个offer不是我发的');
      // const createOffer = await rtc?.rtcStatus.createOffer;
      // if (!createOffer) {
      //   console.log('没有创建offer成功');
      rtc?.setRemoteDescription(data.sdp);
      const sdp = await rtc?.createAnswer();
      console.log(sdp, 'lllll');
      instance.value.socketIo?.emit(wsMsgType.answer, {
        socketId: getSocketId(),
        roomId: roomId.value,
        sdp,
      });
      // }
      // setTimeout(() => {
      //   rtc?.setRemoteDescription(data.sdp);
      // }, 500);
    } else {
      console.log('收到offer，并且这个offer是我发的');
    }
  });

  // 收到answer
  instance.value.socketIo.on(wsMsgType.answer, async (data: IOffer) => {
    console.warn('【websocket】收到answer', data);
    if (!instance.value) return;
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
  instance.value.socketIo.on(wsMsgType.candidate, (data: ICandidate) => {
    console.warn('【websocket】收到candidate', data);
    if (!instance.value) return;
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
        console.log('addIceCandidateaddIceCandidate');
        rtc.peerConnection
          ?.addIceCandidate(candidate)
          .then(() => {
            console.log('candidate成功');
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
  instance.value.socketIo.on(wsMsgType.join, (data) => {
    console.log('【websocket】用户加入房间', data);
    if (!instance.value) return;
  });

  // 用户加入房间
  instance.value.socketIo.on(wsMsgType.joined, (data) => {
    console.log('【websocket】用户加入房间完成', data);
    if (!instance.value) return;
    userList.value.push(instance.value.socketIo?.id!);
    console.warn('开始new WebRTCClass');
    const rtc = new WebRTCClass({ roomId: roomId.value });
    networkStore.updateRtcMap(roomId.value, rtc);
    // const localDesc = await rtc.createOffer();
    // console.log(localDesc);
    // instance.value.socketIo?.emit(wsMsgType.offer, {
    //   sdp: localDesc,
    // });
    if (userList.value.length > 1) {
      sendOffer();
    }
  });

  // 其他用户加入房间
  instance.value.socketIo.on(wsMsgType.otherJoin, (data) => {
    console.log('【websocket】其他用户加入房间', data);
    if (!instance.value) return;
    userList.value.push(data.socketId);
    // sendAnswer(networkStore.rtcMap.get(roomId.value)?.localDescription);
    console.log(localStream.value.getTracks(), 888);
    localStream.value.getTracks().forEach((track) => {
      console.log('tracktrack', track, localStream.value);
      networkStore.rtcMap
        .get(roomId.value)
        ?.myAddTrack(track, localStream.value);
    });
    sendOffer();
  });

  // 用户离开房间
  instance.value.socketIo.on(wsMsgType.leave, (data) => {
    console.log('【websocket】用户离开房间', data);
    if (!instance.value) return;
    instance.value.socketIo?.emit(wsMsgType.leave, {
      roomId: instance.value.roomId,
    });
  });

  // 用户离开房间完成
  instance.value.socketIo.on(wsMsgType.leaved, (data) => {
    console.log('【websocket】用户离开房间完成', data);
    if (!instance.value) return;
    instance.value.close();
  });
}

function leave() {
  if (joinRef.value && leaveRef.value) {
    joinRef.value.disabled = false;
    leaveRef.value.disabled = true;
  }
  if (!instance.value) return;
  instance.value.socketIo?.emit(wsMsgType.leave, {
    roomId: instance.value.roomId,
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 10px;
  video {
    width: 500px;
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
