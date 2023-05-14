<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
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
});
</script>

<style lang="scss" scoped></style>
