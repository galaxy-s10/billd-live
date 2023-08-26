<template>
  <div class="group-wrap">
    <h1 class="title">📢 加群注意</h1>
    <h3 class="title">
      因为<b class="red"> 混子 </b
      >太多，为保证群质量，因此设置了一个小小的加群门槛
    </h3>
    <div class="content">
      <p class="red">进群硬性门槛</p>
      <p>
        1. 本地运行billd-live项目的前台：
        <span
          class="link"
          @click="openToTarget('https://github.com/galaxy-s10/billd-live')"
        >
          https://github.com/galaxy-s10/billd-live
        </span>
      </p>
      <p>
        2. 本地运行billd-live项目的后台：
        <span
          class="link"
          @click="
            openToTarget('https://github.com/galaxy-s10/billd-live-admin')
          "
        >
          https://github.com/galaxy-s10/billd-live-admin
        </span>
      </p>
      <p>
        3. 本地运行billd-live项目的后端：
        <span
          class="link"
          @click="
            openToTarget('https://github.com/galaxy-s10/billd-live-server')
          "
        >
          https://github.com/galaxy-s10/billd-live-server
        </span>
      </p>
      <p>
        4. 没有免费的资料，所有免费的都在
        <span
          class="link"
          @click="openToTarget(bilibiliCollectiondetail)"
        >
          b站视频合集
        </span>
        里，如果你是想进群看看有没有其他免费的资料的话，可以不用进了。
      </p>
      <p>
        5.
        如果你想进群，那就先运行起来项目，不要求正常的运行起来，但起码要运行。然后截图发我确认。
        微信群的初衷是希望让对billd-live感兴趣且热衷开源的人有个交流的地方，
        如果连运行都懒得运行，那么很抱歉，道不同不相为谋。
      </p>
    </div>
    <br />
    <br />
    <div class="content">
      <p>如果你懂技术，建议：</p>
      <div>1. 直接提PR、Issue即可，多为开源做贡献。</div>
    </div>
    <br />
    <br />
    <div class="content">
      <div>如果你不太懂技术，建议：</div>
      <p>
        1. 免费：看我的b站视频合集：<span
          class="link"
          @click="openToTarget(bilibiliCollectiondetail)"
        >
          从零搭建迷你版b站web直播间
        </span>
      </p>
      <p>
        2. 付费：考虑billd-live付费课：
        <span
          class="link"
          @click="openToTarget('https://www.hsslive.cn/article/151')"
        >
          https://www.hsslive.cn/article/151
        </span>
      </p>
      <div>3. 闲聊勿扰。</div>
    </div>
    <br />
    <br />
    <div class="content">
      <div>如果你不懂技术，建议：</div>
      <p>
        1. 你想要私有化部署的，参考：
        <span
          class="link"
          @click="
            openToTarget('https://live.hsslive.cn/privatizationDeployment')
          "
        >
          https://live.hsslive.cn/privatizationDeployment
        </span>
      </p>
      <p>2. 闲聊勿扰。</p>
    </div>

    <img
      src="@/assets/img/my-wechat.webp"
      alt=""
      class="my-wechat"
    />
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';

import { bilibiliCollectiondetail } from '@/constant';
</script>

<style lang="scss" scoped>
.group-wrap {
  padding: 0 10px;
  p {
    margin: 4px 0;
  }
  .title {
    text-align: center;
  }
  .red {
    color: red;
  }
  .link {
    color: $theme-color-gold;
    cursor: pointer;
  }
  .wechat-group {
    height: 500px;
  }
  .my-wechat {
    height: 500px;
  }
}
</style>
