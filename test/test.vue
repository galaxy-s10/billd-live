<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const worker = ref<Worker>();

onMounted(() => {
  worker.value = new Worker('worker.js');
  worker.value.addEventListener('message', (e) => {
    console.log('从 Worker 接收到的消息：', e.data);
  });
  worker.value.postMessage({ type: 'start-loop', delay: 1000 / 30 }); // 发送消息到 Worker
  // setInterval(function () {
  //   console.log(`setInterval在工作${new Date().toLocaleString()}`);
  // }, 100); // 设定间隔为1000毫秒，即1秒
});
</script>

<style lang="scss" scoped></style>
