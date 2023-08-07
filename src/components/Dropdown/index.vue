<template>
  <div class="dropdown-wrap">
    <div
      class="btn"
      @click="emits('update:modelValue', !modelValue)"
    >
      <slot name="btn"></slot>
    </div>
    <div
      class="container"
      :style="{
        display: !isMobile() ? 'auto' : modelValue ? 'block' : 'none',
      }"
    >
      <div class="wrap">
        <slot name="list"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emits = defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.dropdown-wrap {
  position: relative;
  &:hover {
    .container {
      display: block;
    }
  }
  .btn {
    cursor: pointer;
    user-select: none;
  }
  .container {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 3;
    display: none;
    .wrap {
      box-sizing: border-box;
      margin-top: 5px;
      padding: 10px 0;
      border-radius: 5px;
      background-color: #fff;
      box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.1),
        0 2px 6px rgba(0, 0, 0, 0.08);
      color: black;
      font-size: 14px;
    }
  }
}
</style>
