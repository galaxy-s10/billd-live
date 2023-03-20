<template>
  <div>
    <div class="btn">btn</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import { WebSocketClass, wsConnectStatus } from '@/network/websocket';

let _instance;

onMounted(() => {
  const instance = new WebSocketClass({ url: 'ws://localhost:3300' });
  console.log(instance, 11);
  instance.wsInstance?.on(wsConnectStatus.connect, () => {
    console.log('连接websocket成功！');
  });
});
</script>

<style lang="scss" scoped></style>
