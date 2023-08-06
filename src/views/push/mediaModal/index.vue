<template>
  <div class="media-wrap">
    <Modal
      title="添加直播素材"
      :mask-closable="false"
      @close="emits('close')"
    >
      <div class="container">
        <div
          v-if="inputOptions.length"
          class="item"
        >
          <div class="label">设备选择</div>
          <div class="value">
            <n-select
              v-model:value="currentInput.deviceId"
              :options="inputOptions"
            />
          </div>
        </div>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">
            <n-input v-model:value="mediaName" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="margin-right">
          <n-button
            type="primary"
            @click="handleOk"
          >
            确定
          </n-button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, ref, withDefaults } from 'vue';

import { MediaTypeEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';

const mediaName = ref('');
const networkStore = useNetworkStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    mediaType?: MediaTypeEnum;
  }>(),
  {
    mediaType: MediaTypeEnum.camera,
  }
);
const emits = defineEmits(['close', 'ok']);

const inputOptions = ref<{ label: string; value: string }[]>([]);
const currentInput = ref<{
  type: MediaTypeEnum;
  deviceId: string;
}>({
  type: MediaTypeEnum.camera,
  deviceId: '',
});

onMounted(() => {
  init();
});

function handleOk() {
  emits('ok', { ...currentInput.value, mediaName: mediaName.value });
}

async function init() {
  const res = await navigator.mediaDevices.enumerateDevices();
  if (props.mediaType === MediaTypeEnum.microphone) {
    res.forEach((item) => {
      if (item.kind === 'audioinput' && item.deviceId !== 'default') {
        inputOptions.value.push({
          label: item.label,
          value: item.deviceId,
        });
      }
    });
    currentInput.value = {
      ...currentInput.value,
      deviceId: inputOptions.value[0].value,
      type: MediaTypeEnum.microphone,
    };
    mediaName.value = `麦克风-${
      appStore.allTrack.filter((item) => item.type === MediaTypeEnum.microphone)
        .length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.camera) {
    res.forEach((item) => {
      if (item.kind === 'videoinput' && item.deviceId !== 'default') {
        inputOptions.value.push({
          label: item.label,
          value: item.deviceId,
        });
      }
    });
    currentInput.value = {
      ...currentInput.value,
      deviceId: inputOptions.value[0].value,
      type: MediaTypeEnum.camera,
    };
    mediaName.value = `摄像头-${
      appStore.allTrack.filter((item) => item.type === MediaTypeEnum.camera)
        .length + 1
    }`;
  } else if (props.mediaType === MediaTypeEnum.screen) {
    currentInput.value = {
      ...currentInput.value,
      type: MediaTypeEnum.screen,
    };
    mediaName.value = `窗口-${
      appStore.allTrack.filter((item) => item.type === MediaTypeEnum.screen)
        .length + 1
    }`;
  }
}
</script>

<style lang="scss" scoped>
.media-wrap {
  text-align: initial;

  .container {
    .item {
      .label {
        margin: 6px 0;
      }
    }
    .margin-right {
      text-align: right;
    }
  }
}
</style>
