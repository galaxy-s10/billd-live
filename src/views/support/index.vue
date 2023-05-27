<template>
  <div class="support-wrap">
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="handleClick"
      >
        <div
          class="left"
          :style="{ backgroundImage: `url(${item.cover})` }"
        >
          <div
            v-if="item.badge"
            class="badge"
            :style="{ backgroundColor: item.badge_bg }"
          >
            <div class="txt">{{ item.badge }}</div>
          </div>
        </div>
        <div class="right">
          <div class="title">{{ item.name }}</div>
          <div class="info">100%好评</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="price-wrap">
            <span class="price">￥{{ item.price }}</span>
            <del
              v-if="item.price !== item.original_price"
              class="original-price"
            >
              {{ item.original_price }}
            </del>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchGoodsList } from '@/api/goods';
import { GoodsTypeEnum, IGoods } from '@/interface';

const list = ref<IGoods[]>([]);

async function getGoodsList() {
  const res = await fetchGoodsList({
    type: GoodsTypeEnum.support,
    orderName: 'created_at',
    orderBy: 'desc',
  });
  if (res.code === 200) {
    console.log(res.data);
    list.value = res.data.rows;
  }
}
onMounted(() => {
  getGoodsList();
});
function handleClick() {
  window.$message.info('即将推出，敬请期待~');
}
</script>

<style lang="scss" scoped>
.support-wrap {
  margin-top: 30px;
  padding: 0 20px;
  .list {
    display: flex;
    .item {
      display: flex;
      margin-right: 20px;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 30px 0 rgba(238, 242, 245, 0.8);
      cursor: pointer;
      transition: box-shadow 0.2s linear;
      &:hover {
        box-shadow: 4px 4px 20px 0 rgba(205, 216, 228, 0.6);
      }
      .left {
        position: relative;
        margin-right: 10px;
        width: 100px;
        height: 100px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
        .badge {
          position: absolute;
          top: -10px;
          right: -10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          padding: 2px;
          color: white;
          .txt {
            display: inline-block;
            transform-origin: center !important;
            line-height: 1;
            @include minFont(10);
          }
        }
      }
      .right {
        .title {
          font-size: 22px;
        }
        .info {
        }
        .price-wrap {
          display: flex;
          align-items: center;
          .price {
            color: gold;
            font-size: 22px;
          }
          .original-price {
            margin-left: 5px;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
