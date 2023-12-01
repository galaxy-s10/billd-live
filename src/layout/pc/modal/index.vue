<template>
  <n-modal
    v-model:show="showModal"
    title="公告"
    preset="dialog"
    positive-text="OK"
  >
    <p>
      使用obs/ffmpeg推流到billd-live！
      <b
        class="link"
        @click="openToTarget('https://www.hsslive.cn/article/150')"
      >
        查看教程
      </b>
    </p>
    <p>
      <span class="hot">billd-live付费课火热报名中！</span>
      <b
        class="link"
        @click="openToTarget(COMMON_URL.payCoursesArticle)"
      >
        查看详情
      </b>
    </p>
    <p>
      <span class="hot">
        欢迎有兴趣且有能力的各位参与billd-live贡献，如该项目有收益，将分配给所有参与贡献的人！
      </span>
    </p>
  </n-modal>
</template>

<script lang="ts" setup>
import { COMMON_URL } from '@/constant';
import { openToTarget } from 'billd-utils';
import { ref } from 'vue';

// const showModal = ref(process.env.NODE_ENV === 'production');
const showModal = ref(false);
// const showModal = ref(true);
// const showModal = ref(router.currentRoute.value.name === routerName.home);
</script>

<style lang="scss" scoped>
.link {
  color: $theme-color-gold;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}
.hot {
  color: red;
}
</style>
