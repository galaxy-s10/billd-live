<template>
  <div
    v-if="show"
    class="pay-course"
  >
    <img
      src="@/assets/img/pay-course.webp"
      alt=""
      @click="openToTarget(COMMON_URL.payCoursesArticle)"
    />
    <div
      class="close"
      @click="show = false"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

import { COMMON_URL } from '@/constant';

const show = ref(true);
</script>

<style lang="scss" scoped>
.pay-course {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 999;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
  img {
    width: 300px;
  }
  .close {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 1;
    padding: 3px;
    width: 14px;
    height: 14px;
    border-radius: 5px;
    cursor: pointer;

    @include cross(red, 2px);
    &:hover {
      background-color: rgba($color: #000000, $alpha: 0.5);
    }
  }
}
</style>
