<template>
  <div
    class="avatar-wrap"
    :style="{ '--width': size + 'px' }"
  >
    <div class="cycle-wrap">
      <div
        class="avatar"
        :class="{ border }"
        v-lazy:background-image="avatar"
      ></div>
      <template v-if="living && !disableLiving">
        <div class="cycle cycle-1"></div>
        <div class="cycle cycle-2"></div>
        <div class="cycle cycle-3"></div
      ></template>
    </div>
    <div class="border"></div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    avatar?: string;
    size: number;
    living?: boolean;
    border?: boolean;
    disableLiving?: boolean;
  }>(),
  {
    avatar: '',
    size: 100,
    living: false,
    border: false,
    disableLiving: false,
  }
);
</script>

<style lang="scss" scoped>
.avatar-wrap {
  position: relative;
  @keyframes scaleCycle {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }
  .cycle-wrap {
    position: relative;
    width: var(--width);
    height: var(--width);
    .avatar {
      display: inline-block;
      box-sizing: border-box;
      margin: 0 auto;
      width: var(--width);
      height: var(--width);
      border-radius: 50%;
      cursor: pointer;

      @extend %coverBg;
      &.border {
        border: 1px solid $theme-color-gold;
      }
    }
    .cycle {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--width);
      border: 1px solid $theme-color-gold;
      border-radius: 50%;
      animation: scaleCycle 1.5s linear infinite;
      &.cycle-1 {
        animation-delay: 0;
      }
      &.cycle-2 {
        animation-delay: 0.5s;
      }
      &.cycle-3 {
        animation-delay: 1s;
      }
    }
  }
}
</style>
