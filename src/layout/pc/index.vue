<template>
  <div class="layout">
    <!-- <div class="fixed-mask"></div> -->
    <HeadCpt></HeadCpt>
    <div
      class="view"
      :style="{ height: appStore.innerHeight + 'px' }"
    >
      <router-view v-slot="{ Component }">
        <component :is="Component"></component>
      </router-view>
    </div>
    <Sidebar></Sidebar>
    <LoginModal v-if="appStore.showLoginModal"></LoginModal>
    <PayCourse v-if="appStore.usePayCourse"></PayCourse>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';

import HeadCpt from './head/index.vue';

const appStore = useAppStore();
</script>

<style lang="scss" scoped>
.layout {
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
  .fixed-mask {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 50;
    width: 400px;
    height: 300px;
    background-color: #ffd700;
    background-image: linear-gradient(239deg, #ffd700 0%, #ffffff 100%);
    opacity: 0.2;
    filter: blur(70px);
    pointer-events: none;
  }
  .view {
    height: 100%;
    overflow: hidden;
    // overflow: scroll;
    // @extend %customScrollbar;
  }
}
</style>
