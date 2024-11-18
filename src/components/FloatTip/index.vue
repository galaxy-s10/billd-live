<template>
  <div
    class="float-tip-wrap"
    @mousemove="handleMousemove"
    @mouseleave="handleMouseleave"
  >
    <div
      ref="txtRef"
      class="txt"
    >
      {{ handleStrEllipsis(txt, maxLen) }}
    </div>
    <div
      v-if="show && txt.length > maxLen"
      ref="floatTxtRef"
      class="float-txt"
    >
      {{ txt }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';

import { handleStrEllipsis } from '@/utils';

const txtRef = ref<HTMLDivElement>();
const floatTxtRef = ref<HTMLDivElement>();
const menuPosition = reactive({ top: 0, left: 0 });
const show = ref(false);

withDefaults(
  defineProps<{
    txt: string;
    maxLen: number;
  }>(),
  {}
);

function handleMousemove(e: MouseEvent) {
  if (show.value) return;
  show.value = true;
  nextTick(() => {
    if (floatTxtRef.value && txtRef.value) {
      const docW = document.documentElement.clientWidth;
      const docH = document.documentElement.clientHeight;
      const floatTxtRect = floatTxtRef.value.getBoundingClientRect();
      const txtRect = txtRef.value.getBoundingClientRect();
      menuPosition.left = e.clientX;
      menuPosition.top = txtRect.bottom;
      let leftRes = menuPosition.left;
      let topRes = menuPosition.top;
      if (menuPosition.left + floatTxtRect.width > docW) {
        leftRes = docW - floatTxtRect.width;
      }
      if (menuPosition.top + floatTxtRect.height > docH) {
        topRes = txtRect.top - floatTxtRect.height;
        floatTxtRef.value.style.top = `${topRes - 5}px`;
      } else {
        floatTxtRef.value.style.top = `${topRes + 5}px`;
      }
      floatTxtRef.value.style.left = `${leftRes}px`;
    }
  });
}
function handleMouseleave() {
  show.value = false;
}
</script>

<style lang="scss" scoped>
.float-tip-wrap {
  display: inline-block;
  line-height: 1;
  .float-txt {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    padding: 4px 8px;
    border: 1px solid #e4e7e9;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0px 1px 10px 0px #5971c721;
    color: #333;
  }
}
</style>
