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
          :style="{ backgroundImage: `url(${item.img})` }"
        ></div>
        <div class="right">
          <div class="title">{{ item.name }}</div>
          <div class="info">100%好评</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="price-wrap">
            <span class="price">￥{{ item.price }}</span>
            <del
              v-if="item.price !== item.originalPrice"
              class="original-price"
            >
              {{ item.originalPrice }}
            </del>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const list = ref([
  {
    // eslint-disable-next-line
    img: require('@/assets/img/billd.webp'),
    name: '1对1解答（一小时）',
    price: '50.00',
    originalPrice: '50.00',
    desc: '包括但不限于billd-live相关的任何问题。',
  },
  {
    // eslint-disable-next-line
    img: require('@/assets/img/billd2.webp'),
    name: '1对1解答（三小时）',
    price: '120.00',
    originalPrice: '150.00',
    desc: '包括但不限于billd-live相关的任何问题。',
  },
]);

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
        margin-right: 10px;
        width: 100px;
        height: 100px;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;
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
