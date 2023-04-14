<template>
  <div class="head-wrap">
    <div class="left">
      <div
        class="logo"
        @click="router.push('/')"
      >
        Billd直播
      </div>
      <div class="nav">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div class="search">
      <input
        class="ipt"
        type="text"
        placeholder="搜索"
      />
    </div>
    <div class="right">
      <div class="avatar">{{ !userStore.detail && '登录' }}</div>
      <!-- <div class="item">动态</div>
      <div class="item">签到</div>
      <div class="item">饭贩</div> -->
      <div
        v-if="id === '1234'"
        class="start"
        @click="appStore.setLiveStatus(true)"
      >
        我要开播
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

const route = useRoute();
const router = useRouter();

const id = route.query.id;
const userStore = useUserStore();
const appStore = useAppStore();

const list = ref([
  { ico: '', title: '一对一直播' },
  { title: '一对多直播' },
  // { title: '多对多直播' },
  { title: '拉流展示' },
  // { ico: '', title: '首页' },
  // { title: '直播' },
  // { title: '全部' },
  // { title: '网游' },
  // { title: '手游' },
  // { title: '单机游戏' },
]);
</script>

<style lang="scss" scoped>
.head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background-color: #fff;
  box-shadow: inset 0 -1px #f1f2f3 !important;
  .left {
    display: flex;
    align-items: center;
    .logo {
      margin: 0 20px;
      width: 100px;
      height: 40px;
      background-color: skyblue;
      color: white;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
    .nav {
      display: flex;
      align-items: center;
      .item {
        margin-right: 20px;
      }
    }
  }
  .search {
    flex: 1;

    .ipt {
      display: block;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 10px 20px;
      min-width: 200px;
      outline: none;
      border: 1px solid hsla(0, 0%, 60%, 0.2);
      border-radius: 8px;
      border-radius: 10px;
      background-color: #f1f2f3;
      font-size: 14px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    padding-right: 20px;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: skyblue;
      color: white;
      font-size: 14px;
    }
    .item {
      margin-right: 20px;
    }
    .start {
      padding: 5px 10px;
      border-radius: 6px;
      background-color: #f69;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
