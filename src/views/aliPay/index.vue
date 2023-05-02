<template>
  <div></div>
</template>

<script lang="ts" setup>
import { hrefToTarget } from 'billd-utils';

import { fetchAliPay } from '@/api/aliPay';

async function startPay() {
  try {
    const res = await fetchAliPay();
    console.log(res);
    hrefToTarget(res.data);
  } catch (error) {
    console.log(error);
  }
}
startPay();
</script>

<style lang="scss" scoped></style>
