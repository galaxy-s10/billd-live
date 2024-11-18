<template>
  <div class="wrap">
    <div class="nav">
      <div
        class="back"
        @click="router.push({ name: routerName.h5Shop })"
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
          class="original-price"
          v-if="goodsInfo?.original_price !== goodsInfo?.price"
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
    <div class="buy">
      <div
        class="btn"
        @click="handleBuy"
      >
        立即购买
      </div>
    </div>
    <QrPay
      v-if="showQrPay"
      :money="qrcodeInfo.money"
      :goods-id="qrcodeInfo.goodsId"
      :live-room-id="qrcodeInfo.liveRoomId"
    ></QrPay>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsFind } from '@/api/goods';
import { IGoods } from '@/interface';
import router, { routerName } from '@/router';
import { formatMoney } from '@/utils';

const route = useRoute();

const goodsId = ref(-1);
const goodsInfo = ref<IGoods>();
const showQrPay = ref(false);
const qrcodeInfo = reactive({
  money: 0,
  goodsId: -1,
  liveRoomId: -1,
});

onMounted(async () => {
  goodsId.value = +route.params.id;
  if (goodsId.value) {
    const res = await fetchGoodsFind(goodsId.value);
    if (res.code === 200) {
      goodsInfo.value = res.data;
    }
  }
});
function handleBuy() {
  if (goodsInfo.value?.price! <= 0) {
    window.$message.info('该商品是免费的，不需要购买！');
    return;
  }
  showQrPay.value = false;
  nextTick(() => {
    qrcodeInfo.money = goodsInfo.value?.price!;
    qrcodeInfo.goodsId = goodsInfo.value?.id!;
    showQrPay.value = true;
  });
}
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
      min-height: 300px;
      max-width: 100%;
      max-height: 300px;
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
  .buy {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 54px;
    background-color: #fff;
    &::before {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 2;
      display: block;
      height: 0;
      border-top: 1px solid #ddd;
      content: '';
      transform: scaleY(0.5);
      transform-origin: 50% 0;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 95%;
      height: 36px;
      border-radius: 10px;
      background-color: $theme-color-gold;
      color: white;
      font-size: 15px;
    }
  }
}
</style>
