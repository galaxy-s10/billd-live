<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <RenderMarkdown :md="modalContent"></RenderMarkdown>
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
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchSettingsList } from '@/api/settings';
import { THEME_COLOR, appBuildInfo } from '@/constant';
import { useCheckUpdate } from '@/hooks/use-common';
import { useGoogleAd } from '@/hooks/use-google-ad';
import { loginMessage } from '@/hooks/use-login';
import { useCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { getHostnameUrl } from '@/utils';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';
import { getToken } from '@/utils/localStorage/user';

import { fetchAreaList } from './api/area';
import { fetchGlobalMsgMyList } from './api/globalMsg';
import { useTip } from './hooks/use-tip';
import { useAppStore } from './store/app';

const { checkUpdate } = useCheckUpdate();
const appStore = useAppStore();
const cacheStore = useCacheStore();
const userStore = useUserStore();
const route = useRoute();

const showModal = ref(false);
const modalContent = ref('2');

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: THEME_COLOR,
    primaryColorHover: THEME_COLOR,
  },
};

watch(
  () => userStore.userInfo,
  (newval) => {
    if (newval) {
      handleGlobalMsgMyList();
    }
  },
  {
    immediate: true,
  }
);

onMounted(() => {
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
  const res = await fetchGlobalMsgMyList({});
  if (res.code === 200) {
    const data = res.data.rows[0];
    if (data) {
      useTip({
        content: data.content!,
        hiddenCancel: true,
        hiddenClose: true,
      });
    }
  }
}

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

async function getAreaList() {
  const res = await fetchAreaList({ orderName: 'priority', orderBy: 'desc' });
  if (res.code === 200) {
    appStore.areaList = res.data.rows;
  }
}

function initGlobalData() {
  getAreaList();
  initSettings();
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
