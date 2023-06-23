<template>
  <div class="m-head-wrap">
    <div class="logo-bar">
      <div
        class="logo"
        @click="router.push({ name: mobileRouterName.h5 })"
      ></div>
    </div>
    <nav class="nav-list">
      <div
        v-for="(item, index) in navList"
        :key="index"
        class="item"
        :class="{ active: appStore.mobileNav.id === item.id }"
        @click="appStore.setMobileNav(item)"
      >
        {{ item.name }}
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import router, { mobileRouterName } from '@/router';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const navList = ref([
  { id: 1, name: '频道' },
  { id: 2, name: '排行' },
  { id: 3, name: '我的' },
]);

const currentNav = ref(navList.value[0]);
</script>

<style lang="scss" scoped>
.m-head-wrap {
  .logo-bar {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background-color: white;
    .logo {
      width: 90px;
      height: 36px;

      @include setBackground('@/assets/img/logo-txt.png');
    }
  }
  .nav-list {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: white;
    line-height: 40px;
    .item {
      position: relative;
      margin: 0 20px;
      &.active {
        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 4px;
          background-color: $theme-color-gold;
          content: '';
        }
      }
    }
  }
}
</style>
