<template>
  <header class="head-wrap">
    <div class="head">
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
              active: router.currentRoute.value.name === routerName.area,
            }"
            @click.prevent="router.push({ name: routerName.area })"
          >
            分区
          </a>
          <a
            class="item"
            :class="{
              active: router.currentRoute.value.name === routerName.shop,
            }"
            @click.prevent="router.push({ name: routerName.shop })"
          >
            商店
          </a>
          <a
            class="item"
            :href="COMMON_URL.admin"
            @click.prevent="openToTarget(COMMON_URL.admin)"
          >
            直播后台
          </a>
          <a
            class="item"
            :href="COMMON_URL.mobileApk"
            @click.prevent="openToTarget(COMMON_URL.mobileApk)"
          >
            App下载
            <div class="badge">
              <div class="txt">new</div>
            </div>
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
        <Dropdown class="doc">
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
                :href="COMMON_URL.apifox"
                @click.prevent="openToTarget(COMMON_URL.apifox)"
              >
                <div class="txt">接口文档</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
              <a
                class="item"
                :href="COMMON_URL.bilibiliCollectiondetail"
                @click.prevent="
                  openToTarget(COMMON_URL.bilibiliCollectiondetail)
                "
              >
                <div class="txt">b站教程</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
              <a
                class="item"
                :href="COMMON_URL.payCoursesArticle"
                @click.prevent="openToTarget(COMMON_URL.payCoursesArticle)"
              >
                <div class="txt">billd-live付费课</div>
                <VPIconExternalLink class="icon"></VPIconExternalLink>
              </a>
            </div>
          </template>
        </Dropdown>

        <Dropdown class="ecosystem">
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

        <Dropdown class="about">
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
          class="signin"
          :class="{
            active:
              router.currentRoute.value.name ===
              routerName.privatizationDeployment,
          }"
          @click="handleSignin"
        >
          签到
          <div
            class="red-dot"
            v-if="appStore.showSigninRedDot"
          ></div>
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
              <a class="item">
                <div class="txt">腾讯云开播</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.user_srs)"
              >
                <div class="txt">srs开播</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.user_wertc)"
              >
                <div class="txt">webrtc开播</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.user_msr)"
              >
                <div class="txt">msr开播</div>
              </a>
              <a
                class="item"
                @click.prevent="handleStartLive(LiveRoomTypeEnum.user_pk)"
              >
                <div class="txt">一对一打PK</div>
              </a>
            </div>
          </template>
        </Dropdown>

        <div
          v-if="!userStore.userInfo"
          class="qqlogin"
          @click="appStore.showLoginModal = true"
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
  </header>
</template>

<script lang="ts" setup>
import { openToTarget, windowReload } from 'billd-utils';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchCreateSignin, fetchTodayIsSignin } from '@/api/signin';
import Dropdown from '@/components/Dropdown/index.vue';
import VPIconChevronDown from '@/components/icons/VPIconChevronDown.vue';
import VPIconExternalLink from '@/components/icons/VPIconExternalLink.vue';
import { COMMON_URL } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const githubStar = ref('');

const about = ref([
  {
    label: '常见问题',
    routerName: routerName.faq,
    url: '',
  },
  {
    label: '团队',
    routerName: routerName.team,
    url: '',
  },
  {
    label: '官方群',
    routerName: routerName.group,
    url: '',
  },
  {
    label: '版本发布',
    routerName: routerName.release,
    url: '',
  },
]);
const resource = ref([
  {
    label: 'billd-live',
    url: 'https://github.com/galaxy-s10/billd-live',
  },
  {
    label: 'billd-live-server',
    url: 'https://github.com/galaxy-s10/billd-live-server',
  },
  {
    label: 'billd-live-admin',
    url: 'https://github.com/galaxy-s10/billd-live-admin',
  },
  {
    label: 'billd-live-kotlin',
    url: 'https://github.com/galaxy-s10/billd-live-kotlin',
  },
  {
    label: 'billd-live-flutter',
    url: 'https://github.com/galaxy-s10/billd-live-flutter',
  },
  {
    label: 'billd-live-react-native',
    url: 'https://github.com/galaxy-s10/billd-live-react-native',
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

watch(
  () => userStore.userInfo?.id,
  (newval) => {
    if (newval) {
      initSigninStatus();
    }
  },
  {
    immediate: true,
  }
);

async function handleSignin() {
  const res = await fetchCreateSignin({});
  if (res.code === 200) {
    appStore.showSigninRedDot = false;
    // eslint-disable-next-line
    window.$message.success(`签到成功！已连续签到${res.data.nums}天`);
  }
}

async function initSigninStatus() {
  const res = await fetchTodayIsSignin({
    liveRoomId: appStore.liveRoomInfo?.id,
  });
  if (res.code === 200) {
    if (res.data) {
      appStore.showSigninRedDot = false;
    } else {
      appStore.showSigninRedDot = true;
    }
  }
}

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

function handleStartLive(key: LiveRoomTypeEnum) {
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
  box-sizing: border-box;
  min-width: $w-1100;
  width: 100%;
  background-color: #fff;

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    height: $layout-head-h;
    box-shadow: inset 0 -1px #f1f2f3 !important;
    font-size: 15px;
    .badge {
      position: absolute;
      top: -10px;
      right: -10px;
      padding: 0 2px;
      border-radius: 4px;
      background-color: red;
      color: white;
      line-height: 1;
      .txt {
        margin-right: 0;
        transform-origin: top !important;

        @include minFont(10);
      }
    }
    .red-dot {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: red;
    }
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
          width: 150px;
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
      .privatizationDeployment,
      .signin {
        display: flex;
        align-items: center;
        margin-right: 20px;
        color: black;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: $theme-color-gold;
        }
        .txt {
          margin-right: 5px;
        }
      }
      .privatizationDeployment,
      .signin {
        position: relative;
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
            position: relative;
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
}
</style>
