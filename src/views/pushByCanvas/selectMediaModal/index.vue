<template>
  <div class="select-media-wrap">
    <Modal
      title="选择直播素材"
      :mask-closable="false"
      @close="emits('close')"
    >
      <div class="container">
        <n-space justify="center">
          <n-button
            v-for="(item, index) in allMediaTypeList"
            :key="index"
            class="item"
            @click="emits('ok', item.type)"
          >
            {{ item.txt }}
          </n-button>
        </n-space>
      </div>
      <template #footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import { MediaTypeEnum } from '@/interface';

const props = withDefaults(
  defineProps<{
    allMediaTypeList: {
      [index: string]: {
        type: MediaTypeEnum;
        txt: string;
      };
    };
  }>(),
  {}
);
const emits = defineEmits(['close', 'ok']);

onMounted(() => {});
</script>

<style lang="scss" scoped>
.select-media-wrap {
  text-align: initial;

  .container {
    padding-top: 10px;
  }
}
</style>
