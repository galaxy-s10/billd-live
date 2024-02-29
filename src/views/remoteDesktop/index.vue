<template>
  <div>
    <h1>当前是控制方</h1>
    <h1>https://github.com/galaxy-s10/billd-desk</h1>
    <div>
      房间id：{{ roomId }}，我的id：{{ mySocketId }}，<n-button
        @click="copyToClipBoard(mySocketId)"
      >
        复制
      </n-button>
    </div>
    <n-input-group>
      <n-input-group-label>被控id</n-input-group-label>
      <n-input
        :style="{ width: '200px' }"
        placeholder="请输入被控id"
        v-model:value="receiverId"
      />
      <n-button
        type="primary"
        @click="handleRemote"
      >
        开始远程
      </n-button>
      <n-button @click="handleMoveMouse">移动鼠标</n-button>
    </n-input-group>
    <div
      class="wrap"
      ref="remoteVideoRef"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, getRandomString } from 'billd-utils';
import { computed, onMounted, ref } from 'vue';

import { usePull } from '@/hooks/use-pull';
import { useNetworkStore } from '@/store/network';
import {
  WsMsgTypeEnum,
  WsRemoteDeskMoveMsgType,
  WsStartRemoteDesk,
} from '@/types/websocket';

const num = '123456';
const networkStore = useNetworkStore();
const { videoWrapRef, initPull } = usePull(num);
const roomId = ref(num);
const receiverId = ref('');
const remoteVideoRef = ref<HTMLDivElement>();

const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
});

onMounted(() => {
  initPull({
    isRemoteDesk: true,
  });
  videoWrapRef.value = remoteVideoRef.value;
});

function handleMoveMouse() {
  networkStore.wsMap.get(roomId.value)?.send<WsRemoteDeskMoveMsgType['data']>({
    requestId: getRandomString(8),
    msgType: WsMsgTypeEnum.remoteDeskMoveMsg,
    data: {
      roomId: roomId.value,
      sender: mySocketId.value,
      receiver: receiverId.value,
    },
  });
}

function handleRemote() {
  networkStore.wsMap.get(roomId.value)?.send<WsStartRemoteDesk['data']>({
    requestId: getRandomString(8),
    msgType: WsMsgTypeEnum.startRemoteDesk,
    data: {
      roomId: roomId.value,
      sender: mySocketId.value,
      receiver: receiverId.value,
    },
  });
}
</script>

<style lang="scss" scoped>
.wrap {
  display: inline-block;
}
</style>
