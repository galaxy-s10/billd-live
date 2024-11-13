<template>
  <div class="mardown-wrap">
    <MdPreview :modelValue="text" />
  </div>
</template>

<script lang="ts" setup>
import { MdPreview } from 'md-editor-v3';
import { ref, watch } from 'vue';

import 'md-editor-v3/lib/preview.css';

const props = withDefaults(
  defineProps<{
    md: string;
  }>(),
  {
    md: '',
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
  height: 400px;

  @extend %customScrollbar;

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }
}
</style>
