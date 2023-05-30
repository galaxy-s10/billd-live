<template>
  <div class="head-wrap">
    <div class="left">
      <div
        class="logo-wrap"
        @click="router.push('/')"
      >
        <!-- <div class="logo"></div> -->
        <div class="txt">Billd直播</div>
      </div>

      <div class="nav">
        <a
          class="item"
          :class="{
            active: router.currentRoute.value.path === '/',
          }"
          href="/"
          @click.prevent="router.push('/')"
        >
          首页
        </a>
        <a
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.rank,
          }"
          href="/rank"
          @click.prevent="router.push({ name: routerName.rank })"
        >
          排行榜
        </a>
        <a
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.support,
          }"
          href="/support"
          @click.prevent="router.push({ name: routerName.support })"
        >
          付费支持
        </a>
        <a
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.ad,
          }"
          href="/ad"
          @click.prevent="router.push({ name: routerName.ad })"
        >
          广告
        </a>
      </div>
    </div>
    <div class="right">
      <div class="ecosystem">
        <div class="txt">生态系统</div>
        <VPIconChevronDown class="icon"></VPIconChevronDown>
        <div class="list">
          <div class="title">资源</div>
          <a
            v-for="(item, index) in resource"
            :key="index"
            :href="item.url"
            class="item"
            @click="handleJump(item)"
          >
            <div class="txt">{{ item.label }}</div>
            <VPIconExternalLink
              v-if="item.url"
              class="icon"
            ></VPIconExternalLink>
          </a>
          <div class="hr"></div>
          <div class="title">官方库</div>
          <a
            v-for="(item, index) in plugins"
            :key="index"
            class="item"
            :href="item.url"
            @click="handleJump(item)"
          >
            <div class="txt">{{ item.label }}</div>
            <VPIconExternalLink
              v-if="item.url"
              class="icon"
            ></VPIconExternalLink>
          </a>
        </div>
      </div>
      <div class="about">
        <div class="txt">关于</div>
        <VPIconChevronDown class="icon"></VPIconChevronDown>
        <div class="list">
          <a
            v-for="(item, index) in about"
            :key="index"
            class="item"
            :href="item.url"
            @click.prevent="
              item.routerName
                ? router.push({ name: item.routerName })
                : openToTarget(item.url)
            "
          >
            <div class="txt">{{ item.label }}</div>
            <VPIconExternalLink
              v-if="item.url"
              class="icon"
            ></VPIconExternalLink>
          </a>
        </div>
      </div>
      <a
        class="sponsors"
        :class="{
          active: router.currentRoute.value.name === routerName.sponsors,
        }"
        href="/sponsors"
        @click.prevent="router.push({ name: routerName.sponsors })"
      >
        赞助
      </a>
      <a
        class="github"
        target="_blank"
        href="https://github.com/galaxy-s10/billd-live"
      >
        <img
          :src="githubStar"
          alt=""
        />
        <!-- Github -->
      </a>
      <n-dropdown
        v-if="router.currentRoute.value.name !== routerName.push"
        trigger="hover"
        :options="options"
        placement="bottom-end"
        @select="handlePushSelect"
      >
        <div class="start-live">我要开播</div>
      </n-dropdown>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import VPIconChevronDown from '@/components/icons/VPIconChevronDown.vue';
import VPIconExternalLink from '@/components/icons/VPIconExternalLink.vue';
import { loginTip, useQQLogin } from '@/hooks/use-login';
import { liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const githubStar = ref('');

const userOptions = ref([
  {
    label: '退出',
    key: '1',
  },
]);

const about = ref([
  {
    label: '常见问题',
    routerName: routerName.faq,
  },
  {
    label: '团队',
    routerName: routerName.team,
  },
  {
    label: '官方群',
    routerName: routerName.group,
  },
  {
    label: '版本发布',
    routerName: routerName.release,
  },
  {
    label: 'b站视频',
    url: 'https://space.bilibili.com/381307133/channel/seriesdetail?sid=3285689',
  },
]);
const resource = ref([
  {
    label: 'billd-live-server',
    url: 'https://github.com/galaxy-s10/billd-live-server',
  },
  {
    label: 'billd-live-admin',
  },
]);
const plugins = ref([
  {
    label: 'billd-ui',
    url: 'https://github.com/galaxy-s10/billd-ui',
  },
  {
    label: 'billd-cli',
    url: 'https://github.com/galaxy-s10/billd-cli',
  },
  {
    label: 'billd-utils',
    url: 'https://github.com/galaxy-s10/billd-utils',
  },
  {
    label: 'billd-scss',
    url: 'https://github.com/galaxy-s10/billd-scss',
  },
  {
    label: 'billd-html-webpack-plugin',
    url: 'https://github.com/galaxy-s10/billd-html-webpack-plugin',
  },
]);

function handleJump(item) {
  if (item.url) {
    openToTarget(item.url);
  } else {
    window.$message.info('敬请期待！');
  }
}

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
</script>

<style lang="scss" scoped>
.head-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  min-width: $medium-width;
  height: 64px;
  background-color: #fff;
  box-shadow: inset 0 -1px #f1f2f3 !important;
  .hr {
    width: 100%;
    height: 1px;
    background-color: #e7e7e7;
  }
  .left {
    display: flex;
    align-items: center;
    height: 100%;
    .logo-wrap {
      display: flex;
      align-items: center;
      margin-right: 20px;
      cursor: pointer;

      // .logo {
      //   margin-right: 5px;
      //   width: 35px;
      //   height: 35px;
      //   border-radius: 50%;
      //   font-size: 12px;
      //   // animation: rotate 3s linear infinite;

      //   @include setBackground('@/assets/img/logo.webp');
      //   @keyframes rotate {
      //     0% {
      //       transform: rotate(0deg);
      //     }
      //     100% {
      //       transform: rotate(360deg);
      //     }
      //   }
      // }
      .txt {
        color: $theme-color-gold;
        font-weight: 500;
        font-size: 18px;
      }
    }

    .nav {
      display: flex;
      align-items: center;
      height: 100%;
      .item {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 20px;
        height: 100%;
        color: black;
        text-decoration: none;
        cursor: pointer;

        &.active {
          &::after {
            position: absolute;
            top: calc(50% - 8px);
            transform: translateY(-100%);
            right: -5px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: $theme-color-gold;
            content: '';
            transition: all 0.1s ease;
          }
        }
        &:hover {
          color: $theme-color-gold;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    height: 100%;

    .qqlogin {
      box-sizing: border-box;
      margin-right: 15px;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: papayawhip;
      text-align: center;
      font-size: 13px;
      line-height: 35px;
      cursor: pointer;

      @extend %containBg;
    }

    .about,
    .ecosystem,
    .sponsors,
    .github {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 20px;
      height: 100%;
      border-radius: 6px;
      color: black;
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
      .icon {
        fill: currentColor;
      }
      a {
        color: black;
        text-decoration: none;
        font-size: 13px;
      }
      &:hover {
        color: $theme-color-gold;
        .icon {
          color: $theme-color-gold;
        }
      }
    }
    .about,
    .ecosystem {
      &:hover {
        .list {
          display: block;
          .item {
            &:hover {
              color: $theme-color-gold;
              a {
                color: $theme-color-gold;
              }
            }
          }
        }
      }
      .icon {
        margin-left: 5px;
        width: 13px;
      }
      .list {
        position: absolute;
        top: 80%;
        right: 0;
        z-index: 2;
        display: none;
        box-sizing: border-box;
        padding: 10px 0;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1),
          0 2px 6px rgba(0, 0, 0, 0.08);
        .item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          padding: 0 20px;
          color: black;
          .icon {
            width: 13px;
            color: #3c3c4354;
          }
        }
        .title {
          margin: 10px 0 5px;
          padding: 0 20px;
          color: rgba(60, 60, 60, 0.33);
        }
        .title:first-child {
          margin-top: 0;
        }
      }
    }
    .ecosystem {
      .list {
        width: 220px;
      }
    }
    .about {
      .list {
        width: 120px;
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
      margin-right: 20px;
      padding: 5px 15px;
      border-radius: 6px;
      background-color: $theme-color-gold;
      color: white;
      font-size: 13px;
      cursor: pointer;
    }
  }
}
</style>
