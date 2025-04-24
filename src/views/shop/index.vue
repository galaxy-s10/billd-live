<template>
  <div class="shop-wrap">
    <div class="tab-list">
      <div
        v-for="(item, index) in tabList"
        :key="index"
        class="tab"
        :class="{ active: item.key === pageParams.type }"
        @click="changeTab(item.key)"
      >
        {{ item.label }}
      </div>
    </div>
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
          @click="handleBuy(item)"
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
                :max-len="18"
              ></FloatTip>
            </div>
            <div class="price-wrap">
              <span class="rmb">￥</span>
              <span class="price">{{ formatBalance(item.price!, true) }}</span>
              <span
                v-if="item.original_price !== item.price"
                class="original-price"
              >
                <del>￥{{ formatBalance(item.original_price!, true) }}</del>
              </span>
              <span class="pay-num">
                {{ formatPayNum(item.pay_nums!) }}人付款
              </span>
            </div>
          </div>
        </div>
      </LongList>
    </div>
    <Modal
      v-if="showQrPay"
      title="支付"
      @close="showQrPay = !showQrPay"
    >
      <QrPay
        :money="qrcodeInfo.money"
        :goods-id="qrcodeInfo.goodsId"
        :live-room-id="qrcodeInfo.liveRoomId"
      ></QrPay>
      <template v-slot:footer></template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGoodsList } from '@/api/goods';
import { URL_QUERY } from '@/constant';
import { GoodsTypeEnum, IGoods } from '@/interface';
import router from '@/router';
import { formatBalance, formatPayNum } from '@/utils';

const route = useRoute();
const list = ref<IGoods[]>([]);
const topRef = ref<HTMLDivElement>();
const loading = ref(false);

const tabList = ref([
  { label: '礼物', key: GoodsTypeEnum.gift },
  { label: '赞助', key: GoodsTypeEnum.sponsors },
  { label: '服务', key: GoodsTypeEnum.support },
]);

const height = ref(-1);
const hasMore = ref(true);

const showQrPay = ref(false);
const qrcodeInfo = reactive({
  money: 0,
  goodsId: -1,
  liveRoomId: -1,
});

const pageParams = reactive({
  nowPage: 0,
  pageSize: 100,
  type: tabList.value[0].key,
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

function handleBuy(item: IGoods) {
  if (item.price! <= 0) {
    window.$message.info('该商品是免费的，不需要购买！');
    return;
  }
  showQrPay.value = false;
  nextTick(() => {
    qrcodeInfo.money = item.price!;
    qrcodeInfo.goodsId = item.id!;
    showQrPay.value = true;
  });
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

function changeTab(type: GoodsTypeEnum) {
  pageParams.type = type;
  pageParams.nowPage = 0;
  getData(true);
}
</script>

<style lang="scss" scoped>
.shop-wrap {
  padding-left: 30px;
  padding-right: 30px;
  height: 100vh;
  .tab-list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    height: 40px;
    font-size: 14px;

    user-select: none;
    .tab {
      position: relative;
      margin-right: 20px;
      cursor: pointer;
      &.active {
        color: $theme-color-gold;
        font-size: 16px;

        &::after {
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 20px;
          height: 2px;
          border-radius: 10px;
          background-color: $theme-color-gold;
          content: '';
          transform: translateX(-50%);
        }
      }
    }
  }
  .goods-list {
    display: flex;
    flex-wrap: wrap;
    align-content: baseline;
    justify-content: space-between;
    .goods {
      display: flex;
      box-sizing: border-box;
      margin-right: 10px;
      margin-bottom: 15px;
      padding: 18px 10px 10px;
      width: 400px;
      border-radius: 6px;
      box-shadow: 0 4px 30px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .top {
        position: relative;
        margin-right: 20px;
        width: 100px;
        height: 100px;
        flex-shrink: 0;
        @extend %containBg;
        .badge {
          position: absolute;
          top: -10px;
          right: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 2px;
          color: white;
          .txt {
            display: inline-block;
            line-height: 1;
            transform-origin: center !important;

            @include minFont(10);
          }
        }
      }
      .bottom {
        .title {
          margin-top: 10px;
          font-size: 22px;
        }
        .price-wrap {
          display: flex;
          align-items: baseline;
          margin-top: 8px;
          color: $theme-color-gold;
          .rmb {
            font-size: 16px;
          }
          .price {
            font-weight: 500;
            font-size: 28px;
          }
          .original-price {
            color: #999;
            font-size: 14px;
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
