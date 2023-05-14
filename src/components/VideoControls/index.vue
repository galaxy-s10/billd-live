<template>
  <div class="video-controls-wrap">
    <div
      v-if="!appStore.muted"
      class="item"
      @click="appStore.setMuted(!appStore.muted)"
    >
      <n-icon
        size="25"
        color="white"
      >
        <VolumeHighOutline></VolumeHighOutline>
      </n-icon>
    </div>
    <div
      v-else
      class="item"
      @click="appStore.setMuted(!appStore.muted)"
    >
      <n-icon
        size="25"
        color="white"
      >
        <VolumeMuteOutline></VolumeMuteOutline>
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
  height: 40px;
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
