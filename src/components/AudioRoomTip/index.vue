<template>
  <div
    v-if="appStore.allTrack.length > 0 && appStore.isOnlyAudio()"
    class="audio-room-tip-wrap"
  >
    当前是语音房
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.audio-room-tip-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: $theme-color-gold;
  font-size: 40px;
}
</style>
