<template>
  <div v-if="!errMsg.length">{{ currentOauth }}登录...</div>
  <div v-else>非法登录！{{ errMsg }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { handleLogin } from '@/hooks/use-login';
import { PlatformEnum } from '@/interface';
import { clearLoginInfo, getLoginInfo } from '@/utils/cookie';

const route = useRoute();

const errMsg = ref('');
const currentOauth = ref('');

onMounted(async () => {
  const { platform } = route.params;
  const { code, state } = route.query;
  if (!code) {
    errMsg.value = '地址栏缺少code';
    return;
  }
  if (!state) {
    errMsg.value = '地址栏缺少state';
    return;
  }

  const atobStateRes = window.atob(window.decodeURIComponent(state as string));
  let loginInfo = '';

  try {
    const res = JSON.parse(atobStateRes);
    if (!res.dev) {
      // 在第三方登录的时候，都会往cookie里记录环境，因此这里直接读取
      loginInfo = getLoginInfo();
      if (!loginInfo) {
        errMsg.value = 'cookie缺少登录信息';
        return;
      }

      if (state !== window.btoa(window.decodeURIComponent(loginInfo))) {
        errMsg.value = 'state非法';
        return;
      }
    } else {
      loginInfo = atobStateRes;
    }
  } catch (error) {
    errMsg.value = 'state非法';
    return;
  }

  switch (platform) {
    case PlatformEnum.qqLogin:
      currentOauth.value = 'QQ';
      break;
  }

  try {
    const { isMobile, env } = JSON.parse(loginInfo);
    const info = { type: PlatformEnum.qqLogin, data: code };

    if (env === 'qq') {
      if (isMobile) {
        try {
          await handleLogin({
            data: info,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        window.opener.postMessage(info, '*');
        window.close();
      }
    }
  } catch (error) {
    console.log(error);
    clearLoginInfo();
  }
});
</script>

<style lang="scss" scoped></style>
