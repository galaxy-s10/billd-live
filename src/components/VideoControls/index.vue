<template>
  <div class="video-controls-wrap">
    <div class="left">
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

    <div class="right">
      <div class="speed">
        <span class="txt">倍速</span>
        <div class="list">
          <div class="iten">2.0x</div>
          <div class="iten">1.5x</div>
          <div class="iten">1.25x</div>
          <div class="iten">1.0x</div>
          <div class="iten">0.75x</div>
          <div class="iten">0.5x</div>
        </div>
      </div>
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
  padding: 0 20px 0 10px;
  width: 100%;
  z-index: 1;
  height: 40px;
  user-select: none;
  background-image: linear-gradient(
    -180deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.6)
  );
  color: white;
  text-align: initial;
  justify-content: space-between;
  .item {
    cursor: pointer;
  }
  .left {
  }
  .right {
    .speed {
      position: relative;
      &:hover {
        .list {
          display: block;
        }
      }
      .txt {
        cursor: pointer;
      }
      .list {
        position: absolute;
        left: 50%;
        top: 0;
        text-align: center;
        display: none;
        background-color: rgba($color: #000000, $alpha: 0.5);
        transform: translate(-50%, -100%);
        .iten {
          padding: 6px 10px;
          &:not(:last-child) {
            margin-bottom: 4px;
          }
          &:hover {
            background-color: rgba($color: #ffffff, $alpha: 0.1);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
