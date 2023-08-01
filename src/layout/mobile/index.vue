<template>
  <div class="layout">
    <HeadCpt></HeadCpt>
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import HeadCpt from './head/index.vue';

const metaEl = document.querySelector('meta[name="viewport"]');
metaEl?.setAttribute(
  'content',
  'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
);
</script>

<style lang="scss" scoped></style>
