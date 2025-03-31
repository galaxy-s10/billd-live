<template>
  <div class="shop-wrap">
    <div
      ref="topRef"
      v-loading="loading"
      :style="{ height: height + 'px' }"
    >
      <LongList
        ref="longListRef"
        class="goods-list"
        :rootMargin="{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }"
        :status="status"
        @get-list-data="getListData"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          class="goods"
          @click="startPay(item)"
        >
          <div
            v-lazy:background-image="item.cover"
            class="top"
          >
            <div
              v-if="item.badge"
              class="badge"
              :style="{ backgroundColor: item.badge_bg }"
            >
              <div class="txt">{{ item.badge }}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="title">
              <FloatTip
                :txt="item.name"
                :max-len="9"
              ></FloatTip>
            </div>
            <div class="price-wrap">
              <span class="rmb">￥</span>
              <span class="price">{{ formatBalance(item.price!, true) }}</span>
              <span class="pay-num">
                {{ formatPayNum(item.pay_nums!) }}人付款
              </span>
            </div>
          </div>
        </div>
      </LongList>
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
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsList } from '@/api/goods';
import QrPayCpt from '@/components/QrPay/index.vue';
import { URL_QUERY } from '@/constant';
import { GoodsTypeEnum, IGoods } from '@/interface';
import router, { routerName } from '@/router';
import { formatBalance, formatPayNum } from '@/utils';

const route = useRoute();
const list = ref<IGoods[]>([]);
const topRef = ref<HTMLDivElement>();
const loading = ref(false);
const showQrPay = ref(false);
const goodsInfo = reactive({
  money: 0,
  goodsId: -1,
  liveRoomId: -1,
});

// const tabList = ref([
//   { label: '逸鹏的商品', key: GoodsTypeEnum.qypShop },
//   { label: '礼物', key: GoodsTypeEnum.gift },
//   { label: '赞助', key: GoodsTypeEnum.sponsors },
//   { label: '服务', key: GoodsTypeEnum.support },
// ]);

const height = ref(-1);
const hasMore = ref(true);

const pageParams = reactive({
  nowPage: 0,
  pageSize: 50,
  // type: tabList.value[0].key,
  type: GoodsTypeEnum.qypShop,
  orderName: 'price,created_at',
  orderBy: 'asc,desc',
});

const status = ref<'loading' | 'nonedata' | 'allLoaded' | 'normal'>('loading');

function handleStatus() {
  if (loading.value) {
    status.value = 'loading';
  } else if (hasMore.value) {
    status.value = 'normal';
  } else {
    status.value = 'allLoaded';
  }
  if (!list.value?.length) {
    status.value = 'nonedata';
  }
}

function getHeight() {
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().top;
  }
}

function getListData() {
  if (!hasMore.value) return;
  getData();
}

async function getData(clear = false) {
  try {
    loading.value = true;
    status.value = 'loading';
    pageParams.nowPage += 1;
    const res = await fetchGoodsList({
      ...pageParams,
    });
    if (res.code === 200) {
      if (clear) {
        list.value = res.data.rows;
      } else {
        list.value.push(...res.data.rows);
      }
      hasMore.value = res.data.hasMore;
    }
  } catch (error) {
    pageParams.nowPage -= 1;
    console.log(error);
  }
  loading.value = false;
  status.value = 'normal';
  handleStatus();
}

onMounted(() => {
  getHeight();
  window.addEventListener('resize', getHeight);
  const key = route.query[URL_QUERY.goodsType] as GoodsTypeEnum;
  if (GoodsTypeEnum[key] !== undefined) {
    pageParams.type = key;
  } else {
    router.push({ query: {} });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', getHeight);
});

// function changeTab(type: GoodsTypeEnum) {
//   showQrPay.value = false;
//   pageParams.type = type;
//   pageParams.nowPage = 0;
//   getData(true);
// }

function startPay(item: IGoods) {
  router.push({ name: routerName.h5StoreDetail, params: { id: item.id } });
  // if (item.price! <= 0) {
  //   window.$message.info('该商品是免费的，不需要购买！');
  //   return;
  // }
  // showQrPay.value = false;
  // nextTick(() => {
  //   goodsInfo.money = item.price!;
  //   goodsInfo.goodsId = item.id!;
  //   showQrPay.value = true;
  // });
}
</script>

<style lang="scss" scoped>
.shop-wrap {
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #f9f9f9;
  .goods-list {
    position: relative;
    display: flex;
    align-content: baseline;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 10px;
    width: calc(100% + 4px);
    .goods {
      box-sizing: border-box;
      margin-bottom: 3%;
      width: 48.5%;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0 4px 10px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .top {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 130px;

        @extend %containBg;
        .badge {
          position: absolute;
          top: 0px;
          right: 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px 6px;
          border-radius: 4px;
          color: white;
          .txt {
            display: inline-block;
            line-height: 1;
            transform-origin: center !important;

            @include minFont(12);
          }
        }
      }
      .bottom {
        padding: 10px;
        .title {
          font-weight: 500;
          font-size: 16px;
        }
        .price-wrap {
          display: flex;
          align-items: baseline;
          margin-top: 8px;
          color: #ff5000;
          .rmb {
            font-size: 16px;
          }
          .price {
            font-weight: 500;
            font-size: 28px;
          }
          .pay-num {
            margin-left: 5px;
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
