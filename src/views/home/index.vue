<template>
  <div class="home-wrap">
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
      <div>ws状态：{{ networkStore.wsMap.get(roomId!)?.status }}</div>
    </div>
    <div class="right">
      <div>当前房间用户：</div>
      <ul>
        <li
          v-for="item in userList"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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
const roomId = ref<string>();
const instance = ref<WebSocketClass>();
const userList = ref<string[]>([]);

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
    console.log('websocket连接成功', instance.value.socketIo?.id);
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
    if (!instance.value) return;
    console.log('websocket连接断开', instance.value);
    instance.value.status = statusEnum.disconnect;
    instance.value.update();
  });

  // 用户加入房间
  instance.value.socketIo.on(wsMsgType.join, (data) => {
    if (!instance.value) return;
    console.log('用户加入房间', data);
  });

  // 用户加入房间
  instance.value.socketIo.on(wsMsgType.joined, (data) => {
    if (!instance.value) return;
    console.log('用户加入房间完成', data);
    userList.value.push(instance.value.socketIo?.id!);
  });

  // 其他用户加入房间
  instance.value.socketIo.on(wsMsgType.otherJoin, (data) => {
    if (!instance.value) return;
    console.log('其他用户加入房间', data);
    userList.value.push(data.socketId);
  });

  // 用户离开房间
  instance.value.socketIo.on(wsMsgType.leave, (data) => {
    if (!instance.value) return;
    console.log('用户离开房间', data);
  });
}

function leave() {
  if (joinRef.value && leaveRef.value) {
    joinRef.value.disabled = false;
    leaveRef.value.disabled = true;
  }
  if (!instance.value) return;
  instance.value.close();
}
</script>

<style lang="scss" scoped>
.home-wrap {
  display: flex;
  padding: 10px;
  .left {
    margin-right: 50px;
    .join-btn {
      margin-left: 10px;
    }
  }
  .right {
  }
}
</style>
