<template>
  <div class="h5-head-wrap">
    <div class="logo-bar">
      <div
        class="logo"
        @click="router.push({ name: mobileRouterName.h5 })"
      ></div>
      <div class="top-right">
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
        <template v-if="!userStore.userInfo">
          <div
            class="btn"
            @click="appStore.showLoginModal = true"
          >
            登录
          </div>
        </template>
        <n-dropdown
          v-else
          trigger="click"
          :options="options"
          @select="handleSelect"
        >
          <Avatar
            :url="userStore.userInfo.avatar"
            :name="userStore.userInfo.username"
            :size="30"
          ></Avatar>
        </n-dropdown>
      </div>
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
import { useUserStore } from '@/store/user';

const githubStar = ref();
const githubFork = ref();
const route = useRoute();
const appStore = useAppStore();
const userStore = useUserStore();
const options = [
  // { label: '个人信息', key: '1' },
  { label: '退出登录', key: 'logout' },
];

onMounted(() => {
  githubStar.value =
    'https://img.shields.io/github/stars/galaxy-s10/billd-live.svg?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&maxAge=86400';
  githubFork.value =
    'https://img.shields.io/github/forks/galaxy-s10/billd-live.svg?label=Fork&logo=GitHub&labelColor=white&logoColor=black&style=social&maxAge=86400';
});

function handleSelect(key) {
  if (key === 'logout') {
    userStore.logout();
  }
}

function changeRoute(item: AppRootState['navList'][0]) {
  router.push({ name: item.routeName });
}
</script>

<style lang="scss" scoped>
.h5-head-wrap {
  .logo-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background-color: white;
    .logo {
      width: 90px;
      height: 36px;

      @include setBackground('@/assets/img/logo-txt.png');
    }
    .top-right {
      display: flex;
      align-items: center;
      .github {
        display: flex;
        margin-right: 10px;
        img {
          margin-left: 6px;
        }
      }
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: papayawhip;
        font-size: 12px;
        cursor: pointer;

        @extend %coverBg;
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
      margin: 0 15px;
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
