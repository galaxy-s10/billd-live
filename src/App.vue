<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <router-view></router-view>
      <HomeModal
        :show="showModal"
        :content="modalContent"
      ></HomeModal>
    </n-dialog-provider>
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchSettingsList } from '@/api/settings';
import { THEME_COLOR, appBuildInfo } from '@/constant';
import { useCheckUpdate } from '@/hooks/use-common';
import { loginMessage } from '@/hooks/use-login';
import { usePiniaCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { getHostnameUrl } from '@/utils';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';
import { getToken } from '@/utils/localStorage/user';

const { checkUpdate } = useCheckUpdate();
const cacheStore = usePiniaCacheStore();
const userStore = useUserStore();
const route = useRoute();

const showModal = ref(false);
const modalContent = ref('');

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: THEME_COLOR,
    primaryColorHover: THEME_COLOR,
  },
};

onMounted(() => {
  initSettings();
  checkUpdate({
    htmlUrl: getHostnameUrl(),
  });
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

function initSettings() {
  setTimeout(async () => {
    if (route.path !== '/') {
      return;
    }
    const res = await fetchSettingsList({});
    if (res.code === 200) {
      const allowHomeModal = res.data.rows.find(
        (v) => v.key === 'allow_home_modal'
      );
      const homeModalContent = res.data.rows.find(
        (v) => v.key === 'home_modal_content'
      );
      if (allowHomeModal?.value === '1' && homeModalContent?.value) {
        showModal.value = true;
        modalContent.value = homeModalContent.value;
      }
    }
  }, 500);
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
