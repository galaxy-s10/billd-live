<template>
  <div class="head-wrap">
    <div class="left">
      <div
        class="logo-wrap"
        @click="router.push('/')"
      >
        <div class="logo"></div>
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
            active: router.currentRoute.value.name === routerName.shop,
          }"
          href="/shop"
          @click.prevent="router.push({ name: routerName.shop })"
        >
          商店
        </a>
        <a
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.order,
          }"
          href="/order"
          @click.prevent="router.push({ name: routerName.order })"
        >
          订单
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
      </div>
    </div>
    <div class="right">
      <Dropdown
        v-model="dropdownDoc"
        class="doc"
      >
        <template #btn>
          <div class="btn">
            文档<VPIconChevronDown class="icon"></VPIconChevronDown>
          </div>
        </template>
        <template #list>
          <div class="list">
            <a
              class="item"
              @click="quickStart"
            >
              <div class="txt">快速上手</div>
            </a>
            <a
              class="item"
              @click="openToTarget(APIFOX_URL)"
            >
              <div class="txt">接口文档</div>
              <VPIconExternalLink class="icon"></VPIconExternalLink>
            </a>
          </div>
        </template>
      </Dropdown>

      <Dropdown
        v-model="dropdownSys"
        class="ecosystem"
      >
        <template #btn>
          <div class="btn">
            生态系统<VPIconChevronDown class="icon"></VPIconChevronDown>
          </div>
        </template>
        <template #list>
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
        </template>
      </Dropdown>

      <Dropdown
        v-model="dropdownAbout"
        class="about"
      >
        <template #btn>
          <div class="btn">
            关于<VPIconChevronDown class="icon"></VPIconChevronDown>
          </div>
        </template>
        <template #list>
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
        </template>
      </Dropdown>

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
      </a>

      <Dropdown class="start-live">
        <template #btn>
          <div class="btn">我要开播</div>
        </template>
        <template #list>
          <div class="list">
            <a
              class="item"
              @click.prevent="handleStartLive(liveTypeEnum.webrtcPush)"
            >
              <div class="txt">webrtc开播</div>
            </a>
            <a
              class="item"
              @click.prevent="handleStartLive(liveTypeEnum.srsPush)"
            >
              <div class="txt">srs-webrtc开播</div>
            </a>
          </div>
        </template>
      </Dropdown>

      <div
        v-if="!userStore.userInfo"
        class="qqlogin"
        @click="useQQLogin()"
      >
        <div class="btn">登录</div>
      </div>
      <Dropdown
        v-else
        class="qqlogin"
      >
        <template #btn>
          <div
            class="btn"
            :style="{ backgroundImage: `url(${userStore.userInfo.avatar})` }"
          ></div>
        </template>
        <template #list>
          <div class="list">
            <a
              class="item"
              @click.prevent="router.push({ name: routerName.account })"
            >
              <div class="txt">个人信息</div>
            </a>
            <a
              class="item"
              @click.prevent="handleLogout"
            >
              <div class="txt">退出</div>
            </a>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget, windowReload } from 'billd-utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Dropdown from '@/components/Dropdown/index.vue';
import VPIconChevronDown from '@/components/icons/VPIconChevronDown.vue';
import VPIconExternalLink from '@/components/icons/VPIconExternalLink.vue';
import { APIFOX_URL } from '@/constant';
import { loginTip, useQQLogin } from '@/hooks/use-login';
import { liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const githubStar = ref('');
const dropdownDoc = ref(false);
const dropdownSys = ref(false);
const dropdownAbout = ref(false);

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

function handleLogout() {
  userStore.logout();
  setTimeout(() => {
    windowReload();
  }, 500);
}

function handleJump(item) {
  if (item.url) {
    openToTarget(item.url);
  } else {
    window.$message.info('敬请期待！');
  }
}

onMounted(() => {
  githubStar.value =
    'https://img.shields.io/github/stars/galaxy-s10/billd-live?label=Star&logo=GitHub&labelColor=white&logoColor=black&style=social&cacheSeconds=3600';
});

function quickStart() {
  window.$message.info('敬请期待！');
}

function handleStartLive(key) {
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
  padding: 0 30px;
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

      .logo {
        width: 90px;
        height: 56px;

        @include setBackground('@/assets/img/logo-txt.png');
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
            right: -5px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: $theme-color-gold;
            content: '';
            transition: all 0.1s ease;
            transform: translateY(-100%);
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

    .doc,
    .about,
    .ecosystem {
      margin-right: 20px;
      &:hover {
        color: $theme-color-gold;
      }
      .btn {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 5px;
          width: 13px;

          fill: currentColor;
        }
        &:hover {
          color: $theme-color-gold;
        }
      }

      .list {
        width: 120px;
        .item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          padding: 0 15px;
          color: black;
          text-decoration: none;
          cursor: pointer;
          &:hover {
            color: $theme-color-gold;
          }
          .icon {
            margin-left: 5px;
            width: 13px;
            color: #3c3c4354;

            fill: currentColor;
          }
        }
      }
    }
    .ecosystem {
      .list {
        width: 220px;
        .title {
          margin: 10px 0 5px;
          padding: 0 15px;
          color: rgba(60, 60, 60, 0.33);

          &:first-child {
            margin-top: 0;
          }
        }
      }
    }

    .github,
    .sponsors {
      display: flex;
      align-items: center;
      margin-right: 20px;
      color: black;
      text-decoration: none;
      &:hover {
        color: $theme-color-gold;
      }
      .txt {
        margin-right: 5px;
      }
    }

    .start-live {
      margin-right: 20px;

      .btn {
        padding: 5px 15px;
        border-radius: 6px;
        background-color: $theme-color-gold;
        color: white;
        font-size: 13px;
        cursor: pointer;
      }
      .list {
        width: 150px;
        .item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          padding: 0 15px;
          cursor: pointer;
          &:hover {
            color: $theme-color-gold;
          }
        }
      }
    }
    .qqlogin {
      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: papayawhip;
        font-size: 13px;
        cursor: pointer;

        @extend %containBg;
      }
      .list {
        width: 90px;
        .item {
          display: flex;
          // justify-content: flex-end;
          padding: 0 15px;
          cursor: pointer;
          &:hover {
            color: $theme-color-gold;
          }
        }
      }
    }
  }
}
</style>
