<template>
  <div class="h5-head-wrap">
    <div class="logo-bar">
      <div
        class="logo"
        @click="router.push({ name: mobileRouterName.h5 })"
      ></div>
      <a
        class="github"
        target="_blank"
        href="https://github.com/galaxy-s10/billd-live"
      >
        <img
          :src="githubStar"
          alt=""
        />
        <img
          :src="githubFork"
          alt=""
        />
      </a>
    </div>
    <nav class="nav-list">
      <div
        v-for="(item, index) in appStore.navList"
        :key="index"
        class="item"
        :class="{ active: route.name === item.routeName }"
        @click="changeRoute(item)"
      >
        {{ item.name }}
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import router, { mobileRouterName } from '@/router';
import { AppRootState, useAppStore } from '@/store/app';

const githubStar = ref();
const githubFork = ref();
const route = useRoute();
const appStore = useAppStore();

function changeRoute(item: AppRootState['navList'][0]) {
  router.push({ name: item.routeName });
}

onMounted(() => {
  githubStar.value =
    'https://img.shields.io/github/stars/galaxy-s10/billd-live?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600';
  githubFork.value =
    'https://img.shields.io/github/forks/galaxy-s10/billd-live?label=Fork&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600';
});
</script>

<style lang="scss" scoped>
.h5-head-wrap {
  .logo-bar {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 20px;
    height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background-color: white;
    .logo {
      width: 90px;
      height: 36px;

      @include setBackground('@/assets/img/logo-txt.png');
    }
    .github {
      display: flex;
      img {
        margin-left: 6px;
      }
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
