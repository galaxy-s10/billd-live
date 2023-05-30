<template>
  <div class="release-wrap">
    <div class="content">
      <h1 class="title">版本发布</h1>
      <p>最近更新：{{ billd.lastBuildDate }}</p>
      <p>提交哈希：{{ billd.commitHash }}</p>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">TODO</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BilldHtmlWebpackPluginLog } from '@/interface';

// @ts-ignore
const billd: BilldHtmlWebpackPluginLog = process.env.BilldHtmlWebpackPlugin;
</script>

<style lang="scss" scoped>
.release-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);

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
  }
  .aside {
    padding-left: 90px;
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
    }
  }
}
</style>
