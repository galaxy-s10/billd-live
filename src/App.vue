<template>
  <div>
    <router-view></router-view>
    <video
      id="localVideo"
      ref="localVideoRef"
      autoplay
      playsinline
      :muted="muted"
    ></video>
    <div>
      <button @click="startAction">start</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { WebRTCClass } from '@/network/webRtc';
import { WebSocketClass, wsConnectStatus } from '@/network/websocket';

const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();

let stream: MediaStream;

onMounted(() => {
  const instance = new WebSocketClass({ url: 'ws://localhost:4300' });
  instance.wsInstance?.on(wsConnectStatus.connect, () => {
    console.log('连接websocket成功！');
    handleWebRtc();
  });
});

async function handleWebRtc() {
  const webrtc = new WebRTCClass();
  console.log(webrtc);
  const offer = await webrtc.createOffer();
  console.log(offer);
}

// Handles start button action: creates local MediaStream.
function startAction() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((event) => {
      console.log('getUserMedia成功', event);
      stream = event;
      // if (!localVideoRef.value) return;
      // localVideoRef.value.srcObject = event;
    })
    .catch((err) => {
      console.log('getUserMedia失败', err);
    });
}
</script>

<style lang="scss" scoped></style>
