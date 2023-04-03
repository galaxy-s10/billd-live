<template>
  <div class="home-wrap">
    房间号：<input
      v-model="roomId"
      type="text"
      placeholder="输入房间号"
    />
    <button
      class="join-btn"
      @click="join"
    >
      进入
    </button>
    <button
      class="join-btn"
      @click="leave"
    >
      退出
    </button>
    <div>状态：{{ networkStore.wsMap.get(roomId)?.status }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { WebSocketClass } from '@/network/webSocket';
import { useNetworkStore } from '@/store/network';

const networkStore = useNetworkStore();

const roomId = ref<string>();
let instance: WebSocketClass;

function join() {
  console.log(roomId.value);
  if (!roomId.value) {
    console.error('房间号不能为空！');
    return;
  }
  instance = new WebSocketClass({
    roomId: roomId.value,
    url: 'ws://localhost:4300',
  });
  networkStore.updateWsMap(roomId.value, instance);

  // instance.socketIo?.on(wsConnectStatus.connect, () => {
  //   console.log(new Date().toLocaleString(), '连接websocket成功！');
  // });

  // // 断开连接中
  // instance.socketIo?.on(wsConnectStatus.disconnecting, (reason) => {
  //   console.log(new Date().toLocaleString(), '断开websocket连接中', reason);
  // });

  // // 已断开连接
  // instance.socketIo?.on(wsConnectStatus.disconnect, (reason) => {
  //   console.log(new Date().toLocaleString(), '已断开websocket连接', reason);
  // });
}

function leave() {
  instance.close();
}
</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 10px;
  .join-btn {
    margin-left: 10px;
  }
}
</style>
