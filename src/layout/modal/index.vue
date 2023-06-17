<template>
  <n-modal
    v-model:show="showModal"
    title="公告"
    preset="dialog"
    positive-text="OK"
  >
    <p>
      billd-live开始支持ffmpeg、obs推流，欢迎体验！
      <b
        class="link"
        @click="openToTarget('https://www.hsslive.cn/article/150')"
      >
        查看教程
      </b>
    </p>
    <p>
      billd-live付费课开始预定！299元/人，定金50，付定金后减50，实付249！<b
        class="link"
        @click="openToTarget('https://www.hsslive.cn/article/151')"
      >
        查看详情
      </b>
    </p>
  </n-modal>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

import router, { routerName } from '@/router';
// const showModal = ref(process.env.NODE_ENV === 'production');
// const showModal = ref(false);
// const showModal = ref(true);
const showModal = ref(router.currentRoute.value.name === routerName.home);
</script>

<style lang="scss" scoped>
.link {
  color: $theme-color-gold;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}
</style>
