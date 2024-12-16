<template>
  <div
    class="mardown-wrap"
    :style="{ height: height ? height + 'px' : 'auto' }"
  >
    <MdPreview :modelValue="text" />
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3';
import { ref, watch } from 'vue';

import 'md-editor-v3/lib/preview.css';

const props = withDefaults(
  defineProps<{
    md?: string;
    height?: number;
  }>(),
  {
    md: '',
    height: 0,
  }
);
const text = ref('');

watch(
  () => props.md,
  (val) => {
    text.value = val || '';
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.mardown-wrap {
  overflow: scroll;
  width: 100%;

  @extend %customScrollbarHide;

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }
}
</style>
