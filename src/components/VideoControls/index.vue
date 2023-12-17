<template>
  <div class="video-controls-wrap">
    <div class="left">
      <div
        class="play"
        @click="changePlay"
      >
        <n-icon size="25">
          <Pause v-if="appStore.play"></Pause>
          <Play v-else></Play>
        </n-icon>
      </div>
      <div
        class="refresh"
        @click="debounceRefresh"
      >
        <n-icon size="25">
          <RefreshSharp></RefreshSharp>
        </n-icon>
      </div>
      <div
        class="muted"
        @click="changeMuted"
      >
        <n-popover
          placement="top"
          trigger="hover"
          :flip="false"
          :style="{ padding: '4px 4px 24px 4px' }"
          :show-arrow="false"
        >
          <template #trigger>
            <n-icon size="25">
              <VolumeMuteOutline v-if="cacheStore.muted"></VolumeMuteOutline>
              <VolumeHighOutline v-else></VolumeHighOutline>
            </n-icon>
          </template>
          <div class="slider">
            <div class="txt">{{ cacheStore.volume }}</div>
            <n-slider
              :value="cacheStore.volume"
              :step="1"
              vertical
              :tooltip="false"
              @update-value="changeVolume"
            />
          </div>
        </n-popover>
      </div>
    </div>

    <div class="right">
      <div
        class="resolution"
        v-if="resolution"
      >
        {{ resolution }}
      </div>
      <div class="line">
        <span
          class="txt"
          @click="showLine = !showLine"
        >
          线路
        </span>
        <div
          class="list"
          :class="{ show: showLine }"
        >
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
        <span
          class="txt"
          @click="showSpeed = !showSpeed"
        >
          倍速
        </span>
        <div
          class="list"
          :class="{ show: showSpeed }"
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
import {
  Pause,
  Play,
  RefreshSharp,
  VolumeHighOutline,
  VolumeMuteOutline,
} from '@vicons/ionicons5';
import { debounce } from 'billd-utils';
import { ref } from 'vue';

import { LiveLineEnum, LiveRoomTypeEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';

withDefaults(
  defineProps<{
    resolution?: string;
  }>(),
  {}
);

const emits = defineEmits(['refresh']);

const debounceRefresh = debounce(() => {
  emits('refresh');
}, 500);
const cacheStore = usePiniaCacheStore();
const appStore = useAppStore();
const showLine = ref(false);
const showSpeed = ref(false);

function handleTip() {
  window.$message.info('敬请期待！');
}

function changeMuted() {
  cacheStore.setMuted(!cacheStore.muted);
}
function changeVolume(v) {
  cacheStore.setVolume(v);
}
function changePlay() {
  appStore.setPlay(!appStore.play);
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
.slider {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 24px;
  height: 80px;
  text-align: center;
  .txt {
    font-size: 12px;
  }
}
.video-controls-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 50;
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
  .left {
    display: flex;
    align-items: center;
    .muted,
    .refresh,
    .play {
      display: flex;
      align-items: center;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .resolution {
      cursor: no-drop;
    }
    .resolution,
    .line,
    .speed {
      position: relative;
      margin-right: 15px;
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
        &.show {
          display: block;
        }
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
    .speed {
      margin-right: 0;
    }
  }
}
</style>
