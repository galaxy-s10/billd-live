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
        <a
          :class="{
            item: 1,
            active: router.currentRoute.value.name === routerName.rank,
          }"
          href="/rank"
          @click.prevent="router.push({ name: routerName.rank })"
        >
          排行榜
        </a>
        <a
          :class="{
            item: 1,
            active: router.currentRoute.value.name === routerName.support,
          }"
          href="/support"
          @click.prevent="router.push({ name: routerName.support })"
        >
          付费支持
        </a>
        <a
          :class="{
            item: 1,
            active: router.currentRoute.value.name === routerName.sponsors,
          }"
          href="/sponsors"
          @click.prevent="router.push({ name: routerName.sponsors })"
        >
          赞助
        </a>
        <a
          :class="{
            item: 1,
            active: router.currentRoute.value.name === routerName.ad,
          }"
          href="/ad"
          @click.prevent="router.push({ name: routerName.ad })"
        >
          广告
        </a>
        <a
          :class="{
            item: 1,
            active: router.currentRoute.value.name === routerName.about,
          }"
          href="/about"
          @click.prevent="router.push({ name: routerName.about })"
        >
          关于
        </a>
        <div
          v-for="(item, index) in navLeftList.filter(
            (item) => router.currentRoute.value.query.liveType === item.liveType
          )"
          :key="index"
          :class="{
            item: 1,
            active: router.currentRoute.value.query.liveType === item.liveType,
          }"
          @click="goPushPage(item.routerName)"
        >
          {{ item.title }}
        </div>
        <div
          v-for="(item, index) in pullList.filter(
            (item) => router.currentRoute.value.query.liveType === item.liveType
          )"
          :key="index"
          :class="{
            item: 1,
            active: router.currentRoute.value.query.liveType === item.liveType,
          }"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <div class="right">
      <div
        v-if="!userStore.userInfo"
        class="qqlogin"
        @click="useQQLogin()"
      >
        登录
      </div>
      <n-dropdown
        v-else
        trigger="hover"
        :options="userOptions"
        @select="handleUserSelect"
      >
        <div
          class="qqlogin"
          :style="{ backgroundImage: `url(${userStore.userInfo.avatar})` }"
          @click="useQQLogin()"
        ></div>
      </n-dropdown>

      <a
        class="bilibili"
        target="_blank"
        href="https://space.bilibili.com/381307133/channel/seriesdetail?sid=3285689"
      >
        b站视频
      </a>
      <a
        class="github"
        target="_blank"
        href="https://github.com/galaxy-s10/billd-live"
      >
        <span class="txt">github</span>
        <img
          :src="githubStar"
          alt=""
        />
      </a>

      <n-dropdown
        v-if="router.currentRoute.value.name !== routerName.push"
        trigger="hover"
        :options="options"
        @select="handlePushSelect"
      >
        <div class="start-live">我要开播</div>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { loginTip, useQQLogin } from '@/hooks/use-login';
import { liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const githubStar = ref('');

const navLeftList = ref([
  {
    title: 'Webrtc Push',
    routerName: routerName.push,
    liveType: liveTypeEnum.webrtcPush,
  },
  {
    title: 'SRS WebRTC Push',
    routerName: routerName.push,
    liveType: liveTypeEnum.srsPush,
  },
]);

const pullList = ref([
  {
    title: 'Webrtc Pull',
    routerName: routerName.pull,
    liveType: liveTypeEnum.webrtcPull,
  },
  {
    title: 'SRS WebRTC Pull Flv',
    routerName: routerName.pull,
    liveType: liveTypeEnum.srsFlvPull,
  },
  {
    title: 'SRS WebRTC Pull',
    routerName: routerName.pull,
    liveType: liveTypeEnum.srsWebrtcPull,
  },
]);

const userOptions = ref([
  {
    label: '退出',
    key: '1',
  },
]);

const options = ref([
  {
    label: 'webrtc开播',
    key: liveTypeEnum.webrtcPush,
  },
  {
    label: 'srs-webrtc开播',
    key: liveTypeEnum.srsPush,
  },
]);

onMounted(() => {
  githubStar.value =
    'https://img.shields.io/github/stars/galaxy-s10/billd-live?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600';
});

function handleUserSelect(key) {
  if (key === '1') {
    userStore.logout();
  }
}
function handlePushSelect(key) {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: key },
  });
  openToTarget(url.href);
}

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
        color: black;
        text-decoration: none;
        cursor: pointer;

        &.active {
          &::after {
            position: absolute;
            bottom: -6px;
            left: 50%;
            width: 40% !important;
            height: 2px;
            background-color: red;
            content: '';
            transition: all 0.1s ease;
            transform: translateX(-50%);
          }
        }
        &::after {
          width: 0px !important;

          @extend .active;
        }
        &:hover {
          &::after {
            width: 40% !important;
          }
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .qqlogin {
      box-sizing: border-box;
      margin-right: 15px;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: skyblue;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      color: white;
      text-align: center;
      font-size: 13px;
      line-height: 35px;
      cursor: pointer;
    }

    .bilibili,
    .github {
      position: relative;
      margin-right: 15px;
      border-radius: 6px;
      color: black;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
      &.active {
        &::after {
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 40% !important;
          height: 2px;
          background-color: red;
          content: '';
          transition: all 0.1s ease;
          transform: translateX(-50%);
        }
      }
      &::after {
        width: 0px !important;

        @extend .active;
      }
      &:hover {
        &::after {
          width: 40% !important;
        }
      }
    }
    .github {
      display: flex;
      align-items: center;
      .txt {
        margin-right: 5px;
      }
    }
    .start-live {
      margin-right: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      background-color: skyblue;
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
