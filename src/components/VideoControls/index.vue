<template>
  <div class="video-controls-wrap">
    <div
      class="item"
      @click="appStore.setMuted(!appStore.muted)"
    >
      <n-icon
        size="25"
        color="white"
      >
        <VolumeMuteOutline v-if="appStore.muted"></VolumeMuteOutline>
        <VolumeHighOutline v-else></VolumeHighOutline>
      </n-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VolumeHighOutline, VolumeMuteOutline } from '@vicons/ionicons5';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.video-controls-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 10px;
  width: 100%;
  z-index: 1;
  height: 40px;
  user-select: none;
  background-image: linear-gradient(
    -180deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.6)
  );
  text-align: initial;
  .item {
    cursor: pointer;
  }
}
</style>
