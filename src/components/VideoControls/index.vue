<template>
  <div class="video-controls-wrap">
    <div class="left">
      <div
        class="play"
        @click="appStore.playing = !appStore.playing"
      >
        <n-icon size="25">
          <Pause v-if="appStore.playing"></Pause>
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
        @click="cacheStore.muted = !cacheStore.muted"
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
              @update-value="(v) => (cacheStore.volume = v)"
            />
          </div>
        </n-popover>
      </div>
    </div>

    <div class="right">
      <div
        v-if="props.control?.fps && appStore.videoControlsValue.fps"
        class="item fps"
      >
        {{ appStore.videoControlsValue.fps }}帧
      </div>
      <div
        v-if="props.control?.kbs && appStore.videoControlsValue.kbs"
        class="item kbs"
      >
        {{ appStore.videoControlsValue.kbs }}KB/s
      </div>
      <div
        v-if="props.control?.resolution && resolution"
        class="item resolution"
      >
        {{ resolution }}
      </div>
      <div
        v-if="props.control?.line"
        class="item line"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">线路</div>
          </template>
          <template #list>
            <div class="list">
              <div
                v-for="item in lineList"
                :key="item"
                class="iten"
                :class="{ active: appStore.liveLine === item }"
                @click="changeLiveLine(item)"
              >
                {{ item }}
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.speed"
        class="item speed"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">倍速</div>
          </template>
          <template #list>
            <div
              class="list"
              @click="handleTip"
            >
              <div class="iten">2.0x</div>
              <div class="iten">1.5x</div>
              <div class="iten active">1.0x</div>
              <div class="iten">0.5x</div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.renderMode"
        class="item render"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">渲染模式</div>
          </template>
          <template #list>
            <div class="list">
              <div
                v-for="item in LiveRenderEnum"
                :key="item"
                class="iten"
                :class="{
                  active: appStore.videoControlsValue?.renderMode === item,
                }"
                @click="changeRenderMode(item)"
              >
                {{ item }}
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.pipMode"
        class="item pip"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">画中画</div>
          </template>
          <template #list>
            <div class="list">
              <div
                v-for="(item, index) in switchList"
                :key="index"
                class="iten"
                :class="{
                  active: item.value === appStore.videoControlsValue.pipMode,
                }"
                @click="handlePip"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.pageFullMode"
        class="item page-full"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">网页全屏</div>
          </template>
          <template #list>
            <div class="list">
              <div
                v-for="(item, index) in switchList"
                :key="index"
                class="iten"
                :class="{
                  active:
                    item.value === appStore.videoControlsValue.pageFullMode,
                }"
                @click="handlePageFull"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.danmu"
        class="item danmu"
      >
        <Dropdown
          :positon="'center'"
          :is-top="true"
        >
          <template #btn>
            <div class="btn">弹幕</div>
          </template>
          <template #list>
            <div class="list">
              <div
                v-for="(item, index) in switchList"
                :key="index"
                class="iten"
                :class="{
                  active: item.value === appStore.videoControlsValue.danmu,
                }"
                @click="handleDanmu"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="props.control?.fullMode"
        class="item"
      >
        <span
          class="txt"
          @click="emits('fullScreen')"
        >
          全屏
        </span>
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
import { debounce, isSafari } from 'billd-utils';
import { onMounted, onUnmounted, ref } from 'vue';

import { handleTip } from '@/hooks/use-common';
import { LiveLineEnum, LiveRenderEnum } from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { isMSESupported } from '@/utils';

const props = withDefaults(
  defineProps<{
    liveLineList?: string[];
    liveRoom: ILiveRoom;
    resolution?: string;
    control?: AppRootState['videoControls'];
  }>(),
  {
    liveRoom: undefined,
  }
);

const emits = defineEmits([
  'refresh',
  'fullScreen',
  'pageFullScreen',
  'pictureInPicture',
]);

const cacheStore = useCacheStore();
const appStore = useAppStore();

const lineList = ref<any[]>([]);
const switchList = ref([
  { label: '开启', value: true },
  { label: '关闭', value: false },
]);

const debounceRefresh = debounce(() => {
  emits('refresh');
}, 500);

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (props.liveLineList) {
    lineList.value = props.liveLineList;
  } else {
    Object.keys(LiveLineEnum).forEach((v) => {
      lineList.value.push(v);
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function changeRenderMode(item: LiveRenderEnum) {
  if (item === LiveRenderEnum.canvas) {
    window.$message.warning('暂不开放');
    return;
  }
  appStore.videoControlsValue.renderMode = item;
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    if (appStore.videoControlsValue.pageFullMode) {
      window.$message.info('已退出网页全屏');
      appStore.videoControlsValue.pageFullMode = false;
    }
  }
}

function handlePip() {
  if (
    isSafari() &&
    appStore.videoControlsValue.renderMode === LiveRenderEnum.canvas
  ) {
    window.$message.info('请先切换渲染模式为video');
    return;
  }
  emits('pictureInPicture');
  appStore.videoControlsValue.pipMode = !appStore.videoControlsValue.pipMode;
}

function handleDanmu() {
  appStore.videoControlsValue.danmu = !appStore.videoControlsValue.danmu;
}
function handlePageFull() {
  emits('pageFullScreen');
  if (!appStore.videoControlsValue.pageFullMode) {
    window.$message.info('按esc可快速退出网页全屏');
  }
  appStore.videoControlsValue.pageFullMode =
    !appStore.videoControlsValue.pageFullMode;
}

function changeLiveLine(item: LiveLineEnum) {
  if (item === LiveLineEnum.flv && !isMSESupported()) {
    window.$message.warning('当前环境不支持该线路');
    return;
  }
  const type = props.liveRoom.type!;
  if (item === LiveLineEnum['rtmp-rtc']) {
    if (
      [
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
        LiveRoomTypeEnum.tencentcloud_css,
        LiveRoomTypeEnum.tencentcloud_css_pk,
      ].includes(type)
    ) {
      window.$message.info('不支持该线路！');
      return;
    }
  } else if (item === LiveLineEnum.flv || item === LiveLineEnum.hls) {
    if (
      [
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
      ].includes(type)
    ) {
      window.$message.info('不支持该线路！');
      return;
    }
  } else if (item === LiveLineEnum.rtc) {
    if (
      ![
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
      ].includes(type)
    ) {
      window.$message.info('不支持该线路！');
      return;
    }
  }
  appStore.liveLine = item;
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
    180deg,
    rgba(0, 0, 0, 0) 0,
    rgba(0, 0, 0, 0.32) 100%
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
    .item {
      position: relative;
      margin-right: 15px;
      cursor: pointer;
      &.fps,
      &.kbs,
      &.resolution {
        cursor: no-drop;
      }
    }

    .render,
    .pip,
    .resolution,
    .line,
    .speed,
    .page-full,
    .danmu {
      &:hover {
        .list {
          display: block;
        }
      }
      :deep(.wrap) {
        border-radius: 0px;
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: white;
      }
      .list {
        text-align: center;
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
    .line {
      .list {
        width: 75px;
      }
    }
    .pip,
    .page-full,
    .danmu {
      .list {
        width: 60px;
      }
    }

    & > :last-child {
      margin-right: 0px;
    }
  }
}
</style>
