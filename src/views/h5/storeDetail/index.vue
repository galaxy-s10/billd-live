<template>
  <div class="wrap">
    <div class="nav">
      <div
        class="back"
        @click="router.push({ name: routerName.h5Store })"
      >
        <i class="arrow"></i>
      </div>
    </div>
    <div class="cover-wrap">
      <img
        class="cover"
        :src="goodsInfo?.cover"
        alt=""
      />
    </div>
    <div class="info-wrap">
      <div class="price-wrap">
        <span class="rmb">￥</span>
        <span class="price">{{ formatMoney(goodsInfo?.price!, true) }}</span>
        <span
          v-if="goodsInfo?.original_price !== goodsInfo?.price"
          class="original-price"
        >
          <del>￥{{ formatMoney(goodsInfo?.original_price!, true) }}</del>
        </span>
      </div>
      <div class="name-wrap">{{ goodsInfo?.name }}</div>
      <div class="other-wrap">
        <div>库存：{{ goodsInfo?.inventory }}</div>
        <div>销量：{{ goodsInfo?.pay_nums }}</div>
      </div>
    </div>
    <div class="detail-title">商品详情</div>
    <RenderMarkdown :md="goodsInfo?.desc"></RenderMarkdown>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsFind } from '@/api/goods';
import { IGoods } from '@/interface';
import router, { routerName } from '@/router';
import { formatMoney } from '@/utils';

const route = useRoute();

const goodsId = ref(-1);
const goodsInfo = ref<IGoods>();
onMounted(async () => {
  goodsId.value = +route.params.id;
  if (goodsId.value) {
    const res = await fetchGoodsFind(goodsId.value);
    if (res.code === 200) {
      goodsInfo.value = res.data;
    }
  }
});
</script>

<style lang="scss" scoped>
.wrap {
  height: 100vh;
  background-color: #f9f9f9;
  .nav {
    position: fixed;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 20px;
    width: 100%;
    height: 60px;
    .back {
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 26px;
      height: 26px;
      border-radius: 4px;
      background-color: rgba($color: #000000, $alpha: 0.5);
      cursor: pointer;
      .arrow {
        border-color: white;

        @include arrow(left, 8px, 2px);
      }
    }
  }
  .cover-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .cover {
      max-width: 100%;
      max-height: 300px;
      min-height: 300px;
    }
  }
  .info-wrap {
    box-sizing: border-box;
    margin: 14px auto;
    padding: 14px 10px;
    width: 95%;
    border-radius: 10px;
    background-color: #fff;
    .price-wrap {
      display: flex;
      align-items: baseline;
      color: #ff5000;
      .rmb {
        font-size: 16px;
      }
      .price {
        font-weight: 500;
        font-size: 28px;
      }
      .original-price {
        margin-left: 5px;
        color: #999;
        font-size: 14px;
      }
    }
    .name-wrap {
      margin-top: 10px;
      font-size: 20px;
    }
    .other-wrap {
      display: flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      color: #999;
      font-size: 14px;
    }
  }
  .detail-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
    color: #333;
    text-align: center;
    font-weight: bold;
    &::before {
      display: inline-block;
      margin: 0 0.625rem;
      width: 3.0625rem;
      height: 1px;
      background: #dcdfe6;
      content: '';
    }
    &::after {
      display: inline-block;
      margin: 0 0.625rem;
      width: 3.0625rem;
      height: 1px;
      background: #dcdfe6;
      content: '';
    }
  }
}
</style>
