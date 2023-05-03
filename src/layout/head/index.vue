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
          v-for="(item, index) in pushList.filter(
            (item) => router.currentRoute.value.name === item.routerName
          )"
          :key="index"
          :class="{
            item: 1,
            active: router.currentRoute.value.name === item.routerName,
          }"
          @click="goPushPage(item.routerName)"
        >
          {{ item.title }}
        </div>
        <div
          v-for="(item, index) in pullList.filter(
            (item) => router.currentRoute.value.name === item.routerName
          )"
          :key="index"
          :class="{
            item: 1,
            active: router.currentRoute.value.name === item.routerName,
          }"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <!-- <div class="search">
      <input
        class="ipt"
        type="text"
        placeholder="搜索"
      />
    </div> -->
    <div class="right">
      <a
        class="github-btn"
        target="_blank"
        href="https://github.com/galaxy-s10/billd-live"
      >
        <img
          src="https://img.shields.io/github/stars/galaxy-s10/billd-live?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600"
          alt=""
        />
      </a>

      <!-- <iframe
        src="https://ghbtns.com/github-btn.html?user=galaxy-s10&repo=billd-live&type=fork&count=true&v=2"
        frameborder="0"
        scrolling="0"
        width="105px"
        height="21px"
      ></iframe> -->

      <div
        v-if="router.currentRoute.value.name !== routerName.sponsors"
        class="sponsors"
        @click="router.push({ name: routerName.sponsors })"
      >
        赞助支持
      </div>
      <div
        v-if="![routerName.webrtcPush].includes(router.currentRoute.value.name as string)"
        class="start ani"
        @click="goPushPage(routerName.webrtcPush)"
      >
        webrtc开播
      </div>
      <div
        v-if="![routerName.srsWebRtcPush].includes(router.currentRoute.value.name as string)"
        class="start ani"
        @click="goPushPage(routerName.srsWebRtcPush)"
      >
        srs-webrtc开播
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { routerName } from '@/router';

const router = useRouter();

const pushList = ref([
  { title: 'Webrtc Push', routerName: routerName.webrtcPush },
  { title: 'SRS WebRTC Push', routerName: routerName.srsWebRtcPush },
]);

const pullList = ref([
  { title: 'Webrtc Pull', routerName: routerName.webrtcPull },
  { title: 'SRS WebRTC Pull', routerName: routerName.srsWebRtcPull },
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
  min-width: $medium-width;
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
        position: relative;
        padding: 0 10px;
        cursor: pointer;
        &.active {
          &::after {
            position: absolute;
            bottom: -6px;
            left: 50%;
            width: 50%;
            height: 2px;
            background-color: red;
            content: '';
            transition: all 0.1s ease;
            transform: translateX(-50%);
          }
        }
        &::after {
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 0px;
          height: 2px;
          background-color: red;
          content: '';
          transition: all 0.1s ease;
          transform: translateX(-50%);
        }
        &:hover {
          &::after {
            width: 50%;
          }
        }
      }
    }
  }
  // .search {
  //   flex: 1;

  //   .ipt {
  //     display: block;
  //     box-sizing: border-box;
  //     margin: 0 auto;
  //     padding: 10px 20px;
  //     min-width: 200px;
  //     outline: none;
  //     border: 1px solid hsla(0, 0%, 60%, 0.2);
  //     border-radius: 8px;
  //     border-radius: 10px;
  //     background-color: #f1f2f3;
  //     font-size: 14px;
  //   }
  // }
  .right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    @keyframes big-small {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.9);
      }
    }

    .github-btn {
      margin-right: 10px;
      img {
        display: block;
      }
    }

    .sponsors {
      margin-right: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
    }
    .start {
      margin-right: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      background-color: skyblue;
      color: white;
      font-size: 14px;
      cursor: pointer;
      &.ani {
        animation: big-small 1s ease infinite;
      }
    }
  }
}
</style>
