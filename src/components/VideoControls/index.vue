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
      <div class="line">
        <span class="txt">线路</span>
        <div class="list">
          <div
            class="iten"
            :class="{ active: appStore.liveLine === item }"
            v-for="item in LiveLineEnum"
            :key="item"
            @click="changeLiveLine(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="speed">
        <span class="txt">倍速</span>
        <div
          class="list"
          @click="handleTip"
        >
          <div class="iten">2.0x</div>
          <div class="iten">1.5x</div>
          <div class="iten active">1.0x</div>
          <div class="iten">0.5x</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VolumeHighOutline, VolumeMuteOutline } from '@vicons/ionicons5';

import { LiveLineEnum, LiveRoomTypeEnum } from '@/interface';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

function handleTip() {
  window.$message.info('敬请期待~');
}
function changeLiveLine(item) {
  if (
    item === LiveLineEnum.rtc &&
    appStore.liveRoomInfo?.type !== LiveRoomTypeEnum.user_wertc
  ) {
    window.$message.info('不支持该线路！');
    return;
  }
  if (
    appStore.liveRoomInfo?.type === LiveRoomTypeEnum.user_wertc &&
    item !== LiveLineEnum.rtc
  ) {
    window.$message.info('不支持该线路！');
    return;
  }
  appStore.setLiveLine(item);
}
</script>

<style lang="scss" scoped>
.video-controls-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px 0 10px;
  width: 100%;
  height: 40px;
  background-image: linear-gradient(
    -180deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.7)
  );
  color: white;
  text-align: initial;

  user-select: none;
  .item {
    cursor: pointer;
  }
  .left {
  }
  .right {
    display: flex;
    align-items: center;
    .speed,
    .line {
      position: relative;
      margin-left: 15px;
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
        top: 0;
        left: 50%;
        display: none;
        background-color: rgba($color: #000000, $alpha: 0.5);
        text-align: center;
        transform: translate(-50%, -100%);
        .iten {
          padding: 6px 10px;
          &.active {
            color: $theme-color-gold;
          }
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
