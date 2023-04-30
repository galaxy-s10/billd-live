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
          v-for="(item, index) in pushList"
          :key="index"
          :class="{
            item: 1,
            active: router.currentRoute.value.name === item.routerName,
          }"
          @click="goPushPage(item.routerName)"
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
      <a
        href="https://github.com/galaxy-s10/billd-live"
        target="_blank"
        class="github"
      >
        github
      </a>
      <div
        v-if="route.path === '/'"
        class="start"
        @click="goPushPage(routerName.webrtcPush)"
      >
        我要开播
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { routerName } from '@/router';

const router = useRouter();
const route = useRoute();

const pushList = ref([
  // { title: 'Webrtc Pull', routerName: 'webrtcPull' },
  // { title: 'SRS WebRTC Pull', routerName: 'srsWebRtcPull' },
  { title: 'Webrtc Push', routerName: routerName.webrtcPush },
  { title: 'SRS WebRTC Push', routerName: routerName.srsWebRtcPush },
]);

function goPushPage(routerName: string) {
  const url = router.resolve({ name: routerName });
  openToTarget(url.href);
}
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
        padding: 0 10px;
        cursor: pointer;
        position: relative;
        &.active {
          &::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 50%;
            height: 2px;
            background-color: red;
            transition: all 0.1s ease;
          }
        }
        &::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0px;
          height: 2px;
          background-color: red;
          transition: all 0.1s ease;
        }
        &:hover {
          &::after {
            width: 50%;
          }
        }
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
    margin-right: 20px;

    .github {
      margin-right: 20px;
    }

    @keyframes big-small {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.9);
      }
    }

    .start {
      padding: 5px 10px;
      border-radius: 6px;
      background-color: #f69;
      color: white;
      font-size: 14px;
      cursor: pointer;
      animation: big-small 1s ease infinite;
    }
  }
}
</style>
