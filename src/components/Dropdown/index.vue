<template>
  <div
    class="dropdown-wrap"
    :class="{ hover: props.trigger === 'hover' }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="btn">
      <slot name="btn"></slot>
    </div>
    <div
      class="container"
      :class="{ [props.positon]: 1 }"
      :style="{
        display: show ? 'block' : 'none',
      }"
    >
      <div class="wrap">
        <slot name="list"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(false);

const props = withDefaults(
  defineProps<{
    trigger?: 'hover' | 'click';
    positon?: 'left' | 'right';
  }>(),
  {
    trigger: 'hover',
    positon: 'right',
  }
);

function handleClick() {
  console.log('handleClick');
  show.value = true;
}
function handleMouseEnter() {
  console.log('handleMouseEnter');
  if (props.trigger === 'hover') {
    show.value = true;
  }
}
function handleMouseLeave() {
  console.log('handleMouseLeave');
  show.value = false;
}
</script>

<style lang="scss" scoped>
.dropdown-wrap {
  display: inline-block;
  position: relative;
  cursor: initial;
  &.hover {
    &:hover {
      .container {
        display: block;
      }
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
    &.right {
      right: 0;
    }
    &.left {
      left: 0;
    }
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
