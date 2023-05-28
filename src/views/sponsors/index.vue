<template>
  <div class="sponsors-wrap">
    <h1 class="txt">
      截止至{{ onMountedTime }}，已收到：{{ receiveMoney / 100 }}元赞助~
    </h1>
    <div class="pay-list">
      <div
        v-for="(item, index) in payList"
        :key="index"
        class="item"
      >
        <div class="time">发起时间：{{ item.created_at }}，</div>
        <div class="user">
          <template v-if="item.user">
            <img
              :src="item.user.avatar"
              class="avatar"
              alt=""
            />
            <span class="username">{{ item.user.username }}</span>
          </template>
          <span v-else>游客</span>，
        </div>

        <div class="account">支付宝账号：{{ item.buyer_logon_id }}，</div>
        <div class="gift">
          赞助了：{{ item.subject }}（{{ item.total_amount }}元），
        </div>
        <div class="status">
          状态：{{
            item.trade_status === PayStatusEnum.WAIT_BUYER_PAY
              ? '支付中'
              : '已支付'
          }}，
        </div>
        <div class="time">支付时间：{{ item.send_pay_date || '-' }}</div>
      </div>
    </div>
    <h2>开始赞助（支付宝）</h2>
    <div class="gift-list">
      <div
        v-for="(item, index) in sponsorsGoodsList"
        :key="index"
        class="item"
        @click="startPay(item)"
      >
        {{ item.name }}（{{ item.price }}元）
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
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue';

import { fetchGoodsList } from '@/api/goods';
import { fetchOrderList } from '@/api/order';
import QrPayCpt from '@/components/QrPay/index.vue';
import { GoodsTypeEnum, IGoods, IOrder, PayStatusEnum } from '@/interface';

const onMountedTime = ref('');
const payStatusTimer = ref();
const downTimer = ref();
const receiveMoney = ref(0);
const showQrPay = ref(false);
const goodsInfo = reactive({
  money: '0.00',
  goodsId: -1,
  liveRoomId: -1,
});

const payList = ref<IOrder[]>([]);
const sponsorsGoodsList = ref<IGoods[]>([]);

onUnmounted(() => {
  clearInterval(payStatusTimer.value);
  clearInterval(downTimer.value);
});

onMounted(() => {
  onMountedTime.value = new Date().toLocaleString();
  getPayList();
  getGoodsList();
});

async function getGoodsList() {
  const res = await fetchGoodsList({
    type: GoodsTypeEnum.sponsors,
    orderName: 'created_at',
    orderBy: 'desc',
  });
  if (res.code === 200) {
    sponsorsGoodsList.value = res.data.rows;
  }
}

async function getPayList() {
  try {
    const res = await fetchOrderList({
      trade_status: PayStatusEnum.TRADE_SUCCESS,
    });
    if (res.code === 200) {
      payList.value = res.data.rows;
      receiveMoney.value = payList.value.reduce(
        (pre, item) => pre + Number(item.total_amount) * 100,
        0
      );
    }
  } catch (error) {
    console.log(error);
  }
}

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
.sponsors-wrap {
  text-align: center;
  .pay-list {
    display: flex;
    overflow: scroll;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
    height: 200px;
    background-color: papayawhip;
    .item {
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 4px;
      width: 100%;
      text-align: left;

      .user {
        width: 120px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .username {
          @extend %singleEllipsis;
        }
      }
      .account {
        width: 250px;
      }
      .gift {
        width: 260px;
      }
      .status {
        width: 120px;
        text-align: left;
      }
      .time {
        width: 280px;
      }
    }
  }
  .gift-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    .item {
      margin: 5px;
      padding: 5px 10px;
      border-radius: 4px;
      background-color: skyblue;
      cursor: pointer;
    }
  }
}
</style>
