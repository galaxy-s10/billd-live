<template>
  <div class="privatizationDeployment-wrap">
    <div class="content">
      <h1 class="title">私有化部署</h1>
      <div class="desc">
        billd-live
        允许个人用于学习/交流用途，如需用做商业，请提前联系并告知作者。
      </div>
      <div class="list">
        <div class="hr"></div>
        <div class="item">
          <h2>远程协助</h2>
          <p>如果在部署期间遇到问题，可以联系作者获取远程协助（付费）。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>定制服务</h2>
          <p>
            billd-live作为开源项目，不可能满足所有需求。但提供定制服务（付费），如有需要请联系作者。
          </p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>收费标准</h2>
          <p>1.咨询费用：每小时50元。</p>
          <p>2.开发费用：每小时150-300元，具体视情况而定。</p>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>联系方式</h2>
          <p>微信号: shuisheng0095，加微信请备注: 私有化部署+用途</p>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">远程协助</div>
      <div class="item">定制服务</div>
      <div class="item">收费标准</div>
      <div class="item">联系方式</div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.privatizationDeployment-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);

  .content {
    flex: 1;
    font-size: 16px;
    .title {
      margin: 0;
      margin-bottom: 60px;
      font-weight: 500;
      font-size: 40px;
    }
    .hr {
      margin: 60px 0 20px 0;
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }

    .link {
      color: $theme-color-gold;
      text-decoration: none;
      font-weight: 500;
    }
    .list {
      h2 {
        font-weight: 600;
      }

      .item {
        font-size: 16px;
        &.sponsors {
          h3 {
            margin-top: 50px;
            text-align: center;
          }
          .list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
          }
          .bg {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
            box-sizing: border-box;
            margin-bottom: 5px;
            border-radius: 4px;
            background-color: #f9f9f9;
            cursor: pointer;
          }
        }
      }
    }
  }
  .aside {
    padding-left: 90px;
    .title {
      margin-bottom: 8px;
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
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
