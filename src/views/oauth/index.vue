<template>
  <div v-if="!errMsg.length">{{ currentOauth }}登录...</div>
  <div v-else>非法登录！{{ errMsg }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchQrcodeLoginStatus } from '@/api/user';
import { handleQQLogin } from '@/hooks/use-login';
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
    case PlatformEnum.wechatLogin:
      currentOauth.value = 'Wechat';
      break;
  }

  try {
    const { isMobile, env } = JSON.parse(loginInfo);

    if (env === 'qq') {
      const info = { type: PlatformEnum.qqLogin, data: code };
      if (isMobile) {
        try {
          await handleQQLogin({
            data: info,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        window.opener.postMessage(info, '*');
        window.close();
      }
    } else if (env === 'wechat') {
      // eslint-disable-next-line
      const { qr_platform, qr_login_id } = JSON.parse(loginInfo);
      console.log(qr_platform, qr_login_id, '====');
      await fetchQrcodeLoginStatus({
        // eslint-disable-next-line
        platform: qr_platform,
        // eslint-disable-next-line
        login_id: qr_login_id,
      });
    }
  } catch (error) {
    console.log(error);
    clearLoginInfo();
  }
});
</script>

<style lang="scss" scoped></style>
