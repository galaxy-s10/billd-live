<template>
  <aside class="sidebar-wrap">
    <div
      v-if="MODULE_CONFIG_SWITCH.sidebarRank"
      class="item"
      @click="router.push({ name: routerName.rank })"
    >
      <div class="ico rank"></div>
      <div class="txt">排行榜</div>
    </div>
    <div
      v-if="MODULE_CONFIG_SWITCH.sidebarShop"
      class="item"
      @click="router.push({ name: routerName.shop })"
    >
      <div class="ico shop"></div>
      <div class="txt">商店</div>
    </div>
    <div
      v-if="MODULE_CONFIG_SWITCH.sidebarOrder"
      class="item"
      @click="router.push({ name: routerName.order })"
    >
      <div class="ico pay"></div>
      <div class="txt">订单</div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { MODULE_CONFIG_SWITCH } from '@/constant';
import router, { routerName } from '@/router';
</script>

<style lang="scss" scoped>
.sidebar-wrap {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 10;
  padding: 15px 10px;
  width: 50px;
  border-radius: 20px 0 0 20px;
  background-color: white;
  box-shadow: 0 0 20px 1px rgba($theme-color-gold, 0.15);
  color: $theme-color-gold;
  text-align: center;
  transform: translateY(-50%);
  .item {
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .ico {
      margin: 0 auto;
      width: 20px;
      height: 20px;
      opacity: 0.9;

      @extend %containBg;
      &.rank {
        @include setBackground('@/assets/img/rank.png');
      }
      &.shop {
        @include setBackground('@/assets/img/shop.png');
      }
      &.pay {
        @include setBackground('@/assets/img/pay.png');
      }
    }
    .txt {
      font-size: 13px;
    }
  }
}
</style>
