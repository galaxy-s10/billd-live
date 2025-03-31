<template>
  <div class="wrap">
    <div class="title">个人收益</div>
    <div class="card-top">
      钱包余额：{{ formatBalance(userStore.userInfo?.wallet?.balance || 0) }}元
    </div>
    <div class="card">
      <div class="title">消费明细</div>
      <div class="table">
        <div
          v-for="(item, index) in column"
          :key="index"
          class="item top"
        >
          <div class="area-name">{{ item.order_id }}</div>
          <div class="duration">{{ item.client_env }}</div>
          <div class="duration">{{ item.type }}</div>
          <div class="view">{{ item.name }}</div>
          <div class="danmu">{{ item.amount }}</div>
          <!-- <div class="start-time">{{ item.created_at }}</div> -->
          <div class="start-time">{{ item.created_at }}</div>
        </div>
      </div>
      <div class="table height">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item"
        >
          <div class="area-name">{{ item.order_id }}</div>
          <div class="duration">
            {{ clientEnvMap[item.client_env || ''] }}
          </div>
          <div class="duration">
            {{ walletRecordTypeMap[Number(item.type)] }}
          </div>
          <div class="view">{{ item.name }}</div>
          <div class="danmu">
            <span>
              {{
                item.amount_status === WalletRecordAmountStatusEnum.add
                  ? '+'
                  : '-'
              }}
            </span>
            <span>{{ formatBalance(item.amount || 0) }}元</span>
          </div>
          <div class="start-time">{{ item.created_at }}</div>
        </div>
      </div>
      <div class="paging">
        <n-pagination
          v-model:page="params.nowPage"
          :page-size="params.pageSize"
          :item-count="total"
          @update-page="handleUpdatePage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchMyWallet } from '@/api/wallet';
import { fetchWalletRecordMyList } from '@/api/walletRecord';
import { clientEnvMap, walletRecordTypeMap } from '@/constant';
import { IWalletRecord, WalletRecordAmountStatusEnum } from '@/interface';
import { useUserStore } from '@/store/user';
import { formatBalance } from '@/utils';

const userStore = useUserStore();
const total = ref(0);
const loading = ref(false);
const column = [
  {
    order_id: '订单id',
    client_env: '平台',
    type: '类型',
    name: '名称',
    amount: '金额',
    created_at: '创建时间',
  },
];

const params = ref<{
  orderName: string;
  orderBy: string;
  nowPage: number;
  pageSize: number;
}>({
  nowPage: 1,
  pageSize: 20,
  orderBy: 'desc',
  orderName: 'created_at',
});

const list = ref<IWalletRecord[]>([]);
onMounted(() => {
  getMyWallet();
  getList();
});

async function getMyWallet() {
  const res = await fetchMyWallet({});
  if (res.code === 200) {
    if (userStore.userInfo?.wallet?.balance !== undefined) {
      userStore.userInfo.wallet.balance = res.data.balance;
    }
  }
}

async function handleUpdatePage(v) {
  params.value.nowPage = v;
  await getList();
}

async function getList() {
  try {
    loading.value = true;
    const res = await fetchWalletRecordMyList(params.value);
    if (res.code === 200) {
      list.value = res.data.rows;
      total.value = res.data.total;
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
}
</script>

<style lang="scss" scoped>
.wrap {
  .title {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  .card {
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
  }
  .card-top {
    position: relative;
    margin-top: 60px;
    margin-bottom: 20px;
    padding: 20px 30px;
    width: 50%;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;

    .avatar-wrap {
      position: absolute;
      top: -40px;
      left: 30px;
      width: 90px;
      height: 90px;
      border: 2px solid #ececec;
      border-radius: 50%;
      .avatar {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid white;
        border-radius: 50%;
        background-color: white;
        background-image: url('@/assets/img/default-avatar.png');

        @extend %containBg;
      }
    }
    .name-bar {
      box-sizing: border-box;
      padding-top: 10px;
      padding-bottom: 25px;
      padding-left: 105px;
      width: 100%;
      border-bottom: 1px solid #e3e8ec;
    }
    .info-bar {
      box-sizing: border-box;
      padding-top: 30px;
      width: 100%;
      font-size: 12px;
      .item {
        margin-bottom: 20px;
        .val {
          color: $theme-color-gold;
          font-size: 16px;
        }
        .copy {
          margin-left: 30px;
          color: $theme-color-gold;
          cursor: pointer;
        }
      }
    }
  }
  .table {
    position: relative;
    overflow: scroll;
    margin-top: 10px;
    width: 100%;

    @extend %customScrollbar;
    &.height {
      margin-top: 0;
      max-height: 350px;
    }
    .list {
      overflow: scroll;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 16px;
      height: 44px;
      border-bottom: 1px solid #e4e4e4;
      // border-radius: 4px;
      background-color: #fafafa;
      color: #242833;
      text-align: center;
      font-size: 12px;
      &.top {
        border-bottom: 1px solid transparent;
        background-color: #f2f2f4 !important;
      }

      &:nth-child(2n) {
        background-color: #ededed;
      }
      // &:hover {
      //   background-color: #ededed;
      // }

      .start-time {
        width: 200px;
        text-align: center;
      }

      .area-name {
        width: 180px;
        text-align: center;
      }
      .end-time {
        width: 200px;
        text-align: center;
      }
      .duration {
        width: 100px;
        text-align: center;
      }
      .view {
        width: 100px;
      }
      .danmu {
        width: 100px;
      }
    }
  }
  .paging {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
}
</style>
