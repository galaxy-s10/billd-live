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
          v-for="(item, index) in areaList"
          :key="index"
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.ad,
          }"
          href="/ad"
          @click.prevent="changeArea(item)"
        >
          {{ item.name }}
        </a>
        <!-- <a
          class="item"
          :class="{
            active: router.currentRoute.value.name === routerName.ad,
          }"
          href="/ad"
          @click.prevent="router.push({ name: routerName.ad })"
        >
          广告
        </a> -->
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
              @click.prevent="handleJump(item)"
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
              @click.prevent="handleJump(item)"
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
        class="privatizationDeployment"
        :class="{
          active:
            router.currentRoute.value.name ===
            routerName.privatizationDeployment,
        }"
        href="/privatizationDeployment"
        @click.prevent="
          router.push({ name: routerName.privatizationDeployment })
        "
      >
        私有化部署
        <div class="badge">
          <div class="txt">new</div>
        </div>
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
              @click.prevent="handleStartLive(liveTypeEnum.srsPush)"
            >
              <div class="txt">srs开播</div>
            </a>
            <a
              class="item"
              @click.prevent="handleStartLive(liveTypeEnum.webrtcPush)"
            >
              <div class="txt">webrtc开播</div>
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

import { fetchAreaList } from '@/api/area';
import Dropdown from '@/components/Dropdown/index.vue';
import VPIconChevronDown from '@/components/icons/VPIconChevronDown.vue';
import VPIconExternalLink from '@/components/icons/VPIconExternalLink.vue';
import { APIFOX_URL } from '@/constant';
import { loginTip, useQQLogin } from '@/hooks/use-login';
import { IArea, liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const githubStar = ref('');
const dropdownDoc = ref(false);
const dropdownSys = ref(false);
const dropdownAbout = ref(false);
const areaList = ref<IArea[]>([]);

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
    url: 'https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070&ctype=0',
  },
]);
const resource = ref([
  {
    label: 'billd-live-server',
    url: 'https://github.com/galaxy-s10/billd-live-server',
  },
  {
    label: 'billd-live-admin',
    url: 'https://live-admin.hsslive.cn',
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

async function getAreaList() {
  const res = await fetchAreaList();
  if (res.code === 200) {
    areaList.value = res.data.rows;
  }
}

function changeArea(item: IArea) {
  router.push({ name: routerName.area, params: { id: item.id } });
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
  getAreaList();
});

function quickStart() {
  window.$message.info('敬请期待！');
}

function handleStartLive(key: liveTypeEnum) {
  if (!loginTip()) {
    return;
  }
  // if (key === liveTypeEnum.canvasPush) {
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: key },
  });
  // } else {
  //   window.$message.info('请体验canvas混流开播~');
  //   return;
  //   url = router.resolve({
  //     name: routerName.push,
  //     query: { liveType: key },
  //   });
  // }
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.head-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 30px;
  min-width: $w-1100;
  height: 64px;
  background-color: #fff;
  box-shadow: inset 0 -1px #f1f2f3 !important;
  font-size: 15px;
  width: 100%;
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
            width: 14px;
            color: #3c3c4354;

            fill: currentColor;
          }
        }
      }
    }
    .ecosystem {
      .list {
        width: 225px;
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
    .sponsors,
    .privatizationDeployment {
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
    .privatizationDeployment {
      position: relative;
      .badge {
        position: absolute;
        right: -10px;
        top: -10px;
        background-color: red;
        color: white;
        line-height: 1;
        border-radius: 4px;
        padding: 0 2px;
        .txt {
          margin-right: 0;
          @include minFont(10);
          transform-origin: top !important;
        }
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
          &.disabled {
            color: initial !important;
            opacity: 0.5;
            cursor: not-allowed;
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
