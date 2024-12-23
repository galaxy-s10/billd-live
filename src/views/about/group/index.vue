<template>
  <div class="group-wrap">
    <h1 class="title">
      📢 开源只是业余爱好，还得要<i class="red money">挣钱</i>呀~
    </h1>
    <h1 class="title">真正感兴趣（为爱发电）的，无限欢迎提Issue或PR</h1>
    <h1 class="title">
      官方群有人但没人说话，不建议进群。想要进群请运行起来该项目！
    </h1>
    <p>
      {{ PROJECT_NAME }}付费课：
      <span
        class="link"
        @click="openToTarget(COMMON_URL.payCoursesArticle)"
      >
        {{ COMMON_URL.payCoursesArticle }}
      </span>
    </p>
    <div>微信二维码：</div>
    <img
      src="@/assets/img/my-wechat.webp"
      alt=""
      style="width: 250px"
    />
    <div>微信号：{{ AUTHOR_INFO.wechat }}</div>
    <div>qq号：{{ AUTHOR_INFO.qq }}</div>
    <b style="color: red">
      <span>
        注意：项目开源，个人用户有问题github提Issue即可，不必添加作者！
      </span>
      <br />
      <i>如有商业合作，请充分了解该项目。咨询需付费（100元/小时）！</i>
    </b>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';

import { AUTHOR_INFO, COMMON_URL, PROJECT_NAME } from '@/constant';
</script>

<style lang="scss" scoped>
.group-wrap {
  padding-top: calc($header-height + 10px);
  padding-left: 20px;
  padding-right: 20px;
  p {
    margin: 4px 0;
  }
  .title {
    text-align: center;
  }
  .red {
    color: red;
  }
  .money {
    margin: 0 6px 0 4px;
  }
  .link {
    color: $theme-color-gold;
    cursor: pointer;
  }
  .wechat-group {
    height: 500px;
  }
}
</style>
