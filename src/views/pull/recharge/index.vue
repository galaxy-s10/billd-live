<template>
  <div class="recharge-wrap">
    <n-modal
      v-model:show="showModal"
      style="width: 600px"
      title="充值"
      preset="card"
      class="container"
    >
      <div>
        充值金额（最低充值{{ minMoney }}元，最高充值{{ maxMoney }}元）
        <n-input-number
          v-model:value="money"
          :precision="2"
          :min="minMoney"
          :max="maxMoney"
          clearable
        >
          <template #prefix>￥</template>
        </n-input-number>
      </div>
      <n-button
        type="primary"
        @click="startPay"
      >
        确定充值
      </n-button>
      <QrPayCpt
        v-if="showQrPay"
        :money="goodsInfo.money"
        :goods-id="goodsInfo.goodsId"
        :live-room-id="goodsInfo.liveRoomId"
      ></QrPayCpt>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';

import { fetchFindByTypeGoods } from '@/api/goods';
import QrPayCpt from '@/components/QrPay/index.vue';
import { GoodsTypeEnum } from '@/interface';

const showModal = ref(true);
const maxMoney = 200;
const minMoney = 0.1;
const money = ref(minMoney);

const showQrPay = ref(false);
const goodsInfo = reactive({
  money: '0.00',
  goodsId: -1,
  liveRoomId: -1,
});

async function startPay() {
  console.log(money.value, minMoney);
  if (money.value < minMoney) {
    window.$message.warning(`最少充值${minMoney}元`);
    return;
  }
  const res = await fetchFindByTypeGoods(GoodsTypeEnum.recharge);
  if (res.code === 200) {
    showQrPay.value = false;
    nextTick(() => {
      goodsInfo.money = `${money.value}`;
      goodsInfo.goodsId = res.data.id!;
      showQrPay.value = true;
    });
  }
}
</script>

<style lang="scss" scoped>
.recharge-wrap {
}
</style>
