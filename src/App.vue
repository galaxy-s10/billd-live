<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';
import { onMounted } from 'vue';

import { loginMessage } from '@/hooks/use-login';
import { useUserStore } from '@/store/user';
import cache from '@/utils/cache';

const userStore = useUserStore();

onMounted(() => {
  loginMessage();
  const token = cache.getStorageExp('token');
  if (token) {
    userStore.setToken(token);
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
</script>

<style lang="scss">
body {
  font-size: 16px;
  // naive的message会影响全局line-height
  line-height: initial;
}
</style>
<style lang="scss" scoped></style>
