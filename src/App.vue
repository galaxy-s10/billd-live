<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { WebRTCClass } from '@/network/webRtc';
import { useNetworkStore } from '@/store//network';

const muted = ref(true);
const localVideoRef = ref<HTMLVideoElement>();

const networkStore = useNetworkStore();
let stream: MediaStream;

onMounted(() => {
  // const instance = new WebSocketClass({ url: 'ws://localhost:4300' });
  // networkStore.updateWsMap(roomId.value, instance);
  // instance.wsInstance?.on(wsConnectStatus.connect, () => {
  //   console.log('连接websocket成功！');
  //   handleWebRtc();
  // });
});

async function handleWebRtc() {
  const webrtc = new WebRTCClass();
  console.log(webrtc);
  const offer = await webrtc.createOffer();
  console.log(offer);
}

// Handles start button action: creates local MediaStream.
function startAction() {
  // WARN navigator.mediaDevices在localhost和https才能用，http://192.168.1.103:8000局域网用不了
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
