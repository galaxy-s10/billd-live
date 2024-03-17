<template>
  <div class="download-wrap">
    <div class="content">
      <h1 class="title">下载</h1>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>安卓版(flutter)</h2>
          <p>
            最新版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.download.androidFlutter)"
              >v0.0.1</span
            >
          </p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.flutter)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>安卓版(react-native)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.reactNative)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>安卓版(kotlin)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.kotlin)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>苹果版(flutter)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.flutter)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>苹果版(react-native)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.reactNative)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>Windows版(electron)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.electron)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>macOS版(electron)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.electron)"
              >查看</span
            >
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>Linux版(electron)</h2>
          <p>最新版本：<span>todo</span></p>
          <p>
            历史版本：<span
              class="link"
              @click="openToTarget(COMMON_URL.release.electron)"
              >查看</span
            >
          </p>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">安卓版(flutter)</div>
      <div class="item">安卓版(react-native)</div>
      <div class="item">安卓版(kotlin)</div>
      <div class="item">苹果版(flutter)</div>
      <div class="item">苹果版(react-native)</div>
      <div class="item">Windows版(electron)</div>
      <div class="item">macOS版(electron)</div>
      <div class="item">Linux版(electron)</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';

import { fetchServerInfo } from '@/api/other';
import { COMMON_URL } from '@/constant';
import { BilldHtmlWebpackPluginLog, IServerInfo } from '@/interface';
// @ts-ignore
const billd: BilldHtmlWebpackPluginLog = process.env.BilldHtmlWebpackPlugin;

const serverInfo = ref<IServerInfo>();
const loading = ref(false);

async function handleFetchServerInfo() {
  try {
    loading.value = true;
    const res = await fetchServerInfo();
    if (res.code === 200) {
      serverInfo.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  handleFetchServerInfo();
});
</script>

<style lang="scss" scoped>
.download-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);
  .link {
    cursor: pointer;
    color: $theme-color-gold;
  }

  .content {
    flex: 1;
    .title {
      margin: 0;
      font-weight: 500;
      font-size: 40px;
      margin-bottom: 20px;
    }
    .hr {
      margin: 60px 0 20px 0;
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }
    .list {
      h2 {
        font-weight: 600;
      }
      .item {
        position: relative;
        font-size: 16px;
      }
    }
  }

  .aside {
    padding-left: 90px;
    width: 150px;

    .title {
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .item {
      margin-bottom: 8px;
      color: rgba(60, 60, 60, 0.7);
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: #213547;
      }
    }
  }
}
</style>
