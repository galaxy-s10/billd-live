<template>
  <div class="tab-list">
    <div
      v-for="(item, index) in appStore.areaList"
      :key="index"
      class="tab"
      :class="{ active: router.currentRoute.value.params.id === item.id + '' }"
      @click.prevent="changeArea(item)"
    >
      {{ item.name }}
    </div>
    <div v-if="!appStore.areaList.length">暂无分区</div>
  </div>

  <router-view></router-view>
</template>

<script lang="ts" setup>
import { watch } from 'vue';

import { IArea } from '@/interface';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

function changeArea(item: IArea) {
  router.push({ name: routerName.areaDetail, params: { id: item.id } });
}

watch(
  () => appStore.areaList,
  (newval) => {
    if (newval.length) {
      router.push({
        name: routerName.areaDetail,
        params: { id: appStore.areaList[0].id },
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: 40px;
  font-size: 14px;
  padding: 0 30px;

  user-select: none;
  .tab {
    position: relative;
    margin-right: 20px;
    cursor: pointer;
    &.active {
      color: $theme-color-gold;

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
</style>
