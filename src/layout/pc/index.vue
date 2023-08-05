<template>
  <div class="layout">
    <div class="fixed-mask"></div>
    <HeadCpt></HeadCpt>
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
    <ModalCpt></ModalCpt>
    <SidebarCpt></SidebarCpt>
  </div>
</template>

<script lang="ts" setup>
import HeadCpt from './head/index.vue';
import ModalCpt from './modal/index.vue';
import SidebarCpt from './sidebar/index.vue';

document.body.style.minWidth = '1200px';
</script>

<style lang="scss" scoped>
.layout {
  padding-top: 64px;
  min-height: 100vh;
  .fixed-mask {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    width: 600px;
    height: 400px;
    background-color: #ffd700;
    background-image: linear-gradient(239deg, #ffd700 0%, #ffffff 100%);
    opacity: 0.2;
    filter: blur(70px);
    pointer-events: none;
  }
}
</style>
