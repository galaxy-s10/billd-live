<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view></router-view>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import { useCheckUpdate } from '@/hooks/use-checkUpdate';
import { loginMessage } from '@/hooks/use-login';
import { useUserStore } from '@/store/user';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';
import { getToken } from '@/utils/localStorage/user';

import { usePiniaCacheStore } from './store/cache';

const { appInfo } = useCheckUpdate();
const cacheStore = usePiniaCacheStore();
const userStore = useUserStore();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ffd700',
    primaryColorHover: '#ffd700',
  },
};

onMounted(() => {
  handleUpdate();
  loginMessage();
  cacheStore.setMuted(true);
  cacheStore.setVolume(0);
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

function handleUpdate() {
  const old = getLastBuildDate();
  if (appInfo.value.lastBuildDate !== old) {
    localStorage.clear();
  }
  setLastBuildDate(appInfo.value.lastBuildDate);
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
