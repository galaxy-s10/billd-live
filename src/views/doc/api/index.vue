<template>
  <div class="api-doc-wrap">
    <p>
      接口文档：<a
        :href="COMMON_URL.apifox"
        class="link"
        @click.prevent="openToTarget(COMMON_URL.apifox)"
        >apifox</a
      >
    </p>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';

import { COMMON_URL } from '@/constant';
</script>

<style lang="scss" scoped>
.api-doc-wrap {
  padding-top: calc($header-height + 10px);
  padding-left: 20px;
  padding-right: 20px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
