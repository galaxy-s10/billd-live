<template>
  <n-modal
    v-model:show="showModal"
    title="提示"
    preset="dialog"
    positive-text="OK"
  >
    目前billd-live项目的
    <a
      href="https://github.com/galaxy-s10/billd-live"
      target="_blank"
    >
      github仓库
    </a>
    还是公开状态，可能将在不久后设置为私有，但是会对老用户（前20名用户，可以在排行榜看当前用户数量）开放，抓紧时间登录一下吧~
  </n-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// const showModal = ref(process.env.NODE_ENV === 'production');
const showModal = ref(false);
</script>
