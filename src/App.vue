<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider :max="3">
      <n-modal-provider>
        <n-dialog-provider>
          <router-view></router-view>
          <NaiveModal />
          <NaiveMessage />
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
export default {
  name: 'MainApp',
};
</script>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import { fetchAreaList } from '@/api/area';
import { fetchGlobalMsgMyList } from '@/api/globalMsg';
import NaiveMessage from '@/components/NaiveMessage/index.vue';
import NaiveModal from '@/components/NaiveModal/index.vue';
import { THEME_COLOR, appBuildInfo } from '@/constant';
import { useCheckUpdate } from '@/hooks/use-common';
import { useGoogleAd } from '@/hooks/use-google-ad';
import { loginMessage } from '@/hooks/use-login';
import { useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { getHostnameUrl } from '@/utils';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';
import { getToken } from '@/utils/localStorage/user';

const { checkUpdate } = useCheckUpdate();
const appStore = useAppStore();
const cacheStore = useCacheStore();
const userStore = useUserStore();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: THEME_COLOR,
    primaryColorHover: THEME_COLOR,
  },
};

onMounted(() => {
  handleGlobalMsgMyList();
  useGoogleAd();
  initGlobalData();
  checkUpdate({
    htmlUrl: getHostnameUrl(),
  });
  handleUpdate();
  loginMessage();
  cacheStore.muted = true;
  cacheStore.volume = 0;
  const token = getToken();
  if (token) {
    userStore.getUserInfo();
  }

  // 启用vconsole
  // import('vconsole')
  //   .then((VConsole) => {
  //     // eslint-disable-next-line
  //     new VConsole.default();
  //   })
  //   .catch(() => {});
  if (isMobile()) {
    const metaEl = document.querySelector('meta[name="viewport"]');
    metaEl?.setAttribute(
      'content',
      'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
    );
  }
});

async function handleGlobalMsgMyList() {
  const res = await fetchGlobalMsgMyList({
    orderName: 'priority',
    orderBy: 'desc',
  });
  if (res.code === 200) {
    res.data.rows.forEach((item) => {
      window.$modal.create({
        title: '提示',
        preset: 'dialog',
        content: item.content || '',
      });
    });
  }
}

async function getAreaList() {
  const res = await fetchAreaList({ orderName: 'priority', orderBy: 'desc' });
  if (res.code === 200) {
    appStore.areaList = res.data.rows;
  }
}

function initGlobalData() {
  getAreaList();
}

function handleUpdate() {
  const old = getLastBuildDate();
  if (appBuildInfo.lastBuildDate !== old) {
    localStorage.clear();
  }
  setLastBuildDate(appBuildInfo.lastBuildDate);
}
</script>

<style lang="scss">
body {
  font-size: 16px;
  // naive的message会影响全局line-height
  line-height: initial;
}
</style>
<style lang="scss" scoped></style>
