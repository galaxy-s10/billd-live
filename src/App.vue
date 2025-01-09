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
import { isIPad, isMobile } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import { fetchAreaGetTreeArea } from '@/api/area';
import { fetchGlobalMsgGlobal } from '@/api/globalMsg';
import NaiveMessage from '@/components/NaiveMessage/index.vue';
import NaiveModal from '@/components/NaiveModal/index.vue';
import { THEME_COLOR, appBuildInfo } from '@/constant';
import { useGoogleAd } from '@/hooks/use-google-ad';
import { loginMessage } from '@/hooks/use-login';
import { useAppStore } from '@/store/app';
import { useCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';
import { getToken } from '@/utils/localStorage/user';

import { GlobalMsgTypeEnum, SwitchEnum } from './interface';
import { flattenTree } from './utils';

// const { checkUpdate } = useCheckUpdate();
const appStore = useAppStore();
const cacheStore = useCacheStore();
const userStore = useUserStore();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: THEME_COLOR,
    primaryColorHover: THEME_COLOR,
  },
};

handleRemoveGlobalLoading();

onMounted(() => {
  handleGlobalMsgMyList();
  useGoogleAd();
  initGlobalData();
  // checkUpdate({
  //   htmlUrl: getHostnameUrl(),
  // });
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
  if (isMobile() && !isIPad()) {
    const metaEl = document.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl?.setAttribute(
      'content',
      'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
    );
    document.head.appendChild(metaEl);
  }
});

function handleRemoveGlobalLoading() {
  const el = document.querySelector('.b-global-loading') as HTMLDivElement;
  el.style.display = 'none';
}

async function handleGlobalMsgMyList() {
  const res = await fetchGlobalMsgGlobal({
    orderName: 'priority',
    orderBy: 'desc',
    show: SwitchEnum.yes,
  });
  if (res.code === 200) {
    res.data.forEach((item) => {
      if (item.type === GlobalMsgTypeEnum.notification) {
        appStore.notification.push(item);
      } else {
        window.$modal.create({
          title: item.title || '提示',
          preset: 'dialog',
          content: item.content || '',
        });
      }
    });
  }
}

async function getAreaList() {
  const res = await fetchAreaGetTreeArea({
    orderName: 'priority',
    orderBy: 'desc',
    id: 0,
  });
  if (res.code === 200 && res.data) {
    appStore.areaList = res.data;
    const flatdata: any[] = [];
    res.data.forEach((item) => {
      flatdata.push(...flattenTree(item, 'children'));
    });
    appStore.flatAreaList = flatdata;
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
