<template>
  <div class="author-wrap">
    <h1 class="title">作者</h1>
    <p class="desc">
      主业前端开发，兴趣使然，故业余时间开发了{{ PROJECT_NAME }}。
    </p>
    <div class="hr"></div>
    <div class="info">
      联系作者：
      <span
        class="link"
        @click="router.push({ name: routerName.hi })"
      >
        点击查看
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PROJECT_NAME } from '@/constant';
import router, { routerName } from '@/router';
</script>

<style lang="scss" scoped>
.author-wrap {
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: calc($header-height + 10px);
  width: 960px;
  height: 100vh;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }

  .title {
    margin: 0;
    font-weight: 500;
    font-size: 40px;
  }
  .desc {
    margin: 0;
    color: #3c3c3cb3;
    font-size: 16px;
    line-height: 1.8;
  }
  .hr {
    margin: 60px 0 20px 0;
    width: 100%;
    height: 1px;
    background-color: #e7e7e7;
  }
  .info {
    .title {
      font-size: 20px;
    }
    .my-wechat {
      height: 500px;
    }
  }
}
</style>
