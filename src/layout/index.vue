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
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
}
</style>
