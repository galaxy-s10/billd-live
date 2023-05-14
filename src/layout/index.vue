<template>
  <div class="layout">
    <HeadCpt></HeadCpt>
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
    <FooterCpt></FooterCpt>
    <ModalCpt></ModalCpt>
  </div>
</template>

<script lang="ts" setup>
import FooterCpt from './footer/index.vue';
import HeadCpt from './head/index.vue';
import ModalCpt from './modal/index.vue';
</script>

<style lang="scss" scoped>
.layout {
  min-width: $large-width;
  min-height: 100vh;
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .layout {
    min-width: $medium-width;
  }
}
</style>
