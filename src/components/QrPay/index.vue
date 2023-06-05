<template>
  <div class="qr-pay-wrap">
    <div class="money">金额：{{ props.money }}元</div>
    <div class="qrcode-wrap">
      <img
        v-if="aliPayBase64 !== ''"
        class="qrcode"
        :src="aliPayBase64"
        alt=""
      />
      <template v-if="currentPayStatus !== PayStatusEnum.error">
        <div class="mask">
          <div class="txt">
            {{
              currentPayStatus === PayStatusEnum.TRADE_SUCCESS
                ? '支付成功'
                : '等待支付'
            }}
          </div>
        </div>
      </template>
    </div>
    <div v-if="aliPayBase64 !== ''">
      <div class="bottom">
        <div class="sao">打开支付宝扫一扫</div>
        <div class="expr">
          有效期5分钟（{{ formatDownTime(downTimeEnd, downTimeStart) }}）
        </div>
      </div>
    </div>

    <h3
      v-if="currentPayStatus === PayStatusEnum.WAIT_BUYER_PAY"
      class="tip"
    >
      ps：支付宝标题显示：东圃牛杂档，是正常的~
    </h3>

    <div
      v-if="payOk"
      class="bottom"
    >
      <h2>支付成功！</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hrefToTarget, isMobile } from 'billd-utils';
import QRCode from 'qrcode';
import { defineProps, onMounted, onUnmounted, ref } from 'vue';

import { fetchAliPay, fetchAliPayStatus } from '@/api/order';
import { PayStatusEnum } from '@/interface';

const payOk = ref(false);
const aliPayBase64 = ref('');
const payStatusTimer = ref();
const downTimer = ref();
const downTimeStart = ref();
const downTimeEnd = ref();

const currentPayStatus = ref(PayStatusEnum.error);
const props = defineProps({
  money: { type: String, default: '0.00' },
  goodsId: { type: Number, default: -1 },
  liveRoomId: { type: Number, default: -1 },
});

onUnmounted(() => {
  clearInterval(payStatusTimer.value);
  clearInterval(downTimer.value);
});

onMounted(() => {
  startPay({
    goodsId: props.goodsId,
    liveRoomId: props.liveRoomId,
    money: props.money,
  });
});

function formatDownTime(endTime: number, startTime: number) {
  const times = (endTime - startTime) / 1000;
  // js获取剩余天数
  const d = parseInt(String(times / 60 / 60 / 24));
  // js获取剩余小时
  const h = parseInt(String((times / 60 / 60) % 24));
  // js获取剩余分钟
  const m = parseInt(String((times / 60) % 60));
  // js获取剩余秒
  const s = parseInt(String(times % 60));
  if (d > 0) {
    return `${d}天${h}时`;
  } else if (h > 0) {
    return `${h}时${m}分`;
  } else {
    return `${m}分${s}秒`;
  }
}

async function generateQR(text) {
  let base64 = '';
  try {
    base64 = await QRCode.toDataURL(text, {
      margin: 1,
    });
  } catch (err) {
    console.error('生成二维码失败！', err);
  }
  return base64;
}

function handleDownTime() {
  clearInterval(downTimer.value);
  downTimeEnd.value = +new Date() + 1000 * 60 * 5;
  downTimeStart.value = +new Date();
  downTimer.value = setInterval(() => {
    downTimeStart.value = +new Date();
  }, 1000);
}

async function startPay(data: {
  goodsId: number;
  liveRoomId: number;
  money?: string;
}) {
  currentPayStatus.value = PayStatusEnum.error;
  payOk.value = false;
  clearInterval(payStatusTimer.value);
  clearInterval(downTimer.value);
  try {
    const res = await fetchAliPay({
      money: data.money,
      goodsId: data.goodsId,
      liveRoomId: data.liveRoomId,
    });
    if (res.code === 200) {
      if (isMobile()) {
        hrefToTarget(res.data.qr_code);
        return;
      }
      const base64 = await generateQR(res.data.qr_code);
      aliPayBase64.value = base64;
      getPayStatus(res.data.out_trade_no);
      handleDownTime();
    }
  } catch (error) {
    console.log(error);
  }
}

function getPayStatus(outTradeNo: string) {
  clearInterval(payStatusTimer.value);
  payStatusTimer.value = setInterval(async () => {
    try {
      const res = await fetchAliPayStatus({
        out_trade_no: outTradeNo,
      });
      if (res.data.tradeStatus === PayStatusEnum.WAIT_BUYER_PAY) {
        currentPayStatus.value = PayStatusEnum.WAIT_BUYER_PAY;
        console.log('等待支付');
      }
      if (res.data.tradeStatus === PayStatusEnum.TRADE_SUCCESS) {
        currentPayStatus.value = PayStatusEnum.TRADE_SUCCESS;
        clearInterval(downTimer.value);
        clearInterval(payStatusTimer.value);
        console.log('支付成功！');
        payOk.value = true;
      }
    } catch (error) {
      console.log(error);
    }
  }, 2000);
}
</script>

<style lang="scss" scoped>
.qr-pay-wrap {
  padding: 10px;
  .money {
    text-align: center;
    font-size: 20px;
  }
  .qrcode-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 0 auto;
    width: 140px;
    height: 140px;

    .mask {
      position: absolute !important;
      display: flex;
      align-items: center;
      justify-content: center;

      @extend %maskBg;
      .txt {
        color: white;
        font-weight: bold;
      }
    }
  }
  .tip {
    text-align: center;
  }
  .bottom {
    margin-top: 2px;
    width: 100%;
    text-align: center;
    font-size: 14px;
  }
}
</style>
