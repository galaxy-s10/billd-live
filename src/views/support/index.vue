<template>
  <div></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import { GoodsTypeEnum } from '@/interface';
import router, { routerName } from '@/router';

onMounted(() => {
  router.push({
    name: routerName.shop,
    query: { goodsType: GoodsTypeEnum.sponsors },
  });
});
</script>

<style lang="scss" scoped></style>
