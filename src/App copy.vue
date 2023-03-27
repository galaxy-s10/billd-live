<template>
  <div>
    <video
      id="videoElement"
      ref="videoRef"
      style="width: 100vw"
      :muted="muted"
      controls
    ></video>

    <div class="btn">btn</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { WebSocketClass, wsConnectStatus } from '@/network/websocket';

const muted = ref(true);
const videoRef = ref<HTMLVideoElement>();

onMounted(() => {
  // if (flvJs.isSupported() && videoRef.value) {
  //   const flvPlayer = flvJs.createPlayer({
  //     type: 'flv',
  //     url: 'http://localhost:8000/live/fddm_2.flv',
  //   });
  //   flvPlayer.attachMediaElement(videoRef.value);
  //   flvPlayer.load();
  //   try {
  //     flvPlayer.play();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const instance = new WebSocketClass({ url: 'ws://localhost:4300' });
  instance.wsInstance?.on(wsConnectStatus.connect, () => {
    console.log('连接websocket成功！');
  });
});
</script>

<style lang="scss" scoped></style>
