<template>
  <div class="area-list">
    <a
      v-for="(item, index) in areaList"
      :key="index"
      class="item"
      :class="{
        active: router.currentRoute.value.name === routerName.ad,
      }"
      @click.prevent="changeArea(item)"
    >
      {{ item.name }}
    </a>
  </div>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchAreaList } from '@/api/area';
import { IArea } from '@/interface';
import router, { routerName } from '@/router';

const areaList = ref<IArea[]>([]);

function changeArea(item: IArea) {
  router.push({ name: routerName.areaDetail, params: { id: item.id } });
}

async function getAreaList() {
  const res = await fetchAreaList();
  if (res.code === 200) {
    areaList.value = res.data.rows;
    router.push({
      name: routerName.areaDetail,
      params: { id: areaList.value[0].id },
    });
  }
}

onMounted(() => {
  getAreaList();
});
</script>

<style lang="scss" scoped>
.area-list {
  display: flex;
  align-items: center;
  padding: 10px 30px;
  height: 30px;
  .item {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 20px;
    height: 100%;
    color: black;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;

    &.active {
      &::after {
        position: absolute;
        top: calc(50% - 8px);
        right: -5px;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: $theme-color-gold;
        content: '';
        transition: all 0.1s ease;
        transform: translateY(-100%);
      }
    }
    &:hover {
      color: $theme-color-gold;
    }
  }
}
</style>
