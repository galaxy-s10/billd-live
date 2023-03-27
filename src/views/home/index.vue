<template>
  <div class="home-wrap">
    房间号：<input
      type="text"
      placeholder="输入房间号"
    />
    <button
      class="join-btn"
      @click="join"
    >
      进入
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const homeId = ref<number>();

function join() {
  if (!homeId.value) {
    console.error('房间号不能为空！');
    return;
  }
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
