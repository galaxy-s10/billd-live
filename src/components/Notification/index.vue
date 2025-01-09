<template>
  <div class="notification-wrap">
    <div
      v-for="(item, index) in appStore.notification"
      :key="index"
      class="item"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="item.content"></div>
      <!-- eslint-enable -->
      <div
        class="close"
        @click="
          appStore.notification = appStore.notification.filter(
            (v) => v.id !== item.id
          )
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.notification-wrap {
  .item {
    position: relative;
    height: 45px;
    width: 100%;
    background-color: #fefad7;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 14px;
    color: $theme-color-gold;
    :deep(a) {
      color: $theme-color-gold;
      cursor: pointer;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #fff2c6;
    }
    .close {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 14px;
      height: 14px;
      cursor: pointer;
      transform: translateY(-50%);

      @include cross(#bfbfbf, 2px);
    }
  }
}
</style>
