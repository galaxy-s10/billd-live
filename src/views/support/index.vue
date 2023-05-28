<template>
  <div class="support-wrap">
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="startPay(item)"
      >
        <div
          class="left"
          :style="{ backgroundImage: `url(${item.cover})` }"
        >
          <div
            v-if="item.badge"
            class="badge"
            :style="{ backgroundColor: item.badge_bg }"
          >
            <div class="txt">{{ item.badge }}</div>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ item.name }}</div>
          <div class="info">100%好评</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="price-wrap">
            <span class="price">￥{{ item.price }}</span>
            <del
              v-if="item.price !== item.original_price"
              class="original-price"
            >
              {{ item.original_price }}
            </del>
          </div>
        </div>
      </div>
    </div>
    <QrPayCpt
      v-if="showQrPay"
      :money="goodsInfo.money"
      :goods-id="goodsInfo.goodsId"
      :live-room-id="goodsInfo.liveRoomId"
    ></QrPayCpt>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue';

import { fetchGoodsList } from '@/api/goods';
import QrPayCpt from '@/components/QrPay/index.vue';
import { GoodsTypeEnum, IGoods } from '@/interface';

const list = ref<IGoods[]>([]);
const showQrPay = ref(false);
const goodsInfo = reactive({
  money: '0.00',
  goodsId: -1,
  liveRoomId: -1,
});

async function getGoodsList() {
  const res = await fetchGoodsList({
    type: GoodsTypeEnum.support,
    orderName: 'created_at',
    orderBy: 'desc',
  });
  if (res.code === 200) {
    console.log(res.data);
    list.value = res.data.rows;
  }
}

onMounted(() => {
  getGoodsList();
});

function startPay(item: IGoods) {
  showQrPay.value = false;
  nextTick(() => {
    goodsInfo.money = item.price!;
    goodsInfo.goodsId = item.id!;
    showQrPay.value = true;
  });
}
</script>

<style lang="scss" scoped>
.support-wrap {
  margin-top: 30px;
  padding: 0 20px;
  .list {
    display: flex;
    .item {
      display: flex;
      margin-right: 20px;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 30px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .left {
        position: relative;
        margin-right: 10px;
        width: 100px;
        height: 100px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        .badge {
          position: absolute;
          top: -10px;
          right: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          padding: 2px;
          color: white;
          .txt {
            display: inline-block;
            transform-origin: center !important;
            line-height: 1;
            @include minFont(10);
          }
        }
      }
      .right {
        .title {
          font-size: 22px;
        }
        .info {
        }
        .price-wrap {
          display: flex;
          align-items: center;
          .price {
            color: gold;
            font-size: 22px;
          }
          .original-price {
            margin-left: 5px;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
