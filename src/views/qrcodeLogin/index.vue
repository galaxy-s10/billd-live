<template>
  <div class="qrcodeLogin-wrap">
    <div
      class="btn"
      @click="handleClick"
    >
      确认登录
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { useWechatLogin } from '@/hooks/use-login';

const route = useRoute();

function handleClick() {
  // eslint-disable-next-line
  const { platform, exp, login_id } = route.query;
  // eslint-disable-next-line
  if (!platform || !exp || !login_id) {
    window.$message.error('参数缺失！');
    return;
  }
  if (platform === 'wechat') {
    // eslint-disable-next-line
    useWechatLogin({ platform, exp, login_id });
  } else {
    window.$message.error('platform错误！');
  }
}
</script>

<style lang="scss" scoped>
.qrcodeLogin-wrap {
  .btn {
    position: fixed;
    top: 50%;
    left: 50%;
    padding: 10px;
    width: 100px;
    border-radius: 10px;
    background-color: $theme-color-gold;
    color: white;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    transform: translate(-50%, -50%);

    user-select: none;
  }
}
</style>
