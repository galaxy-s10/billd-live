<template>
  <div class="rank-wrap">
    <div class="type-list">
      <div
        v-for="(item, index) in rankType"
        :key="index"
        :class="{ item: 1, active: item.type === currRankType }"
        @click="currRankType = item.type"
      >
        {{ item.label }}
      </div>
    </div>

    <div
      v-if="rankList.length"
      class="rank-list"
    >
      <div class="top">
        <div
          v-for="(item, index) in [rankList[1], rankList[0], rankList[2]]"
          :key="index"
          :class="{ item: 1, [`rank-${item.rank}`]: 1 }"
        >
          <div class="avatar">
            <img
              :src="item.avatar"
              alt=""
            />
            <div class="border"></div>
          </div>
          <div class="username">{{ item.username }}</div>
          <div class="rank">
            <i>0{{ item.rank }}</i>
          </div>
        </div>
      </div>
      <div class="top50-list">
        <div
          v-for="(item, index) in rankList.filter((item, index) => index >= 3)"
          :key="index"
          class="top50-item"
        >
          <div class="rank">
            <i>{{ item.rank > 10 ? item.rank : '0' + item.rank }}</i>
          </div>
          <div class="left">
            <img
              :src="item.avatar"
              class="avatar"
              alt=""
            />
            <div class="username">{{ item.username }}</div>
          </div>
          <div class="right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchUserList } from '@/api/user';

const rankType = ref([
  {
    type: 1,
    label: '主播榜',
  },
  {
    type: 2,
    label: '打赏榜',
  },
  {
    type: 3,
    label: '等级榜',
  },
]);

const currRankType = ref(1);

const mockRank = [
  { username: '-', avatar: '', rank: 1, level: -1, score: -1 },
  { username: '-', avatar: '', rank: 2, level: -1, score: -1 },
  { username: '-', avatar: '', rank: 3, level: -1, score: -1 },
  { username: '-', avatar: '', rank: 4, level: -1, score: -1 },
];
const rankList = ref(mockRank);

async function getUserList() {
  try {
    const res = await fetchUserList();
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          username: item.username!,
          avatar: item.avatar!,
          rank: index + 1,
          level: 1,
          score: 1,
        };
      });
      if (length < 3) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.rank-wrap {
  box-sizing: border-box;
  padding-top: 10px;
  height: calc(100vh - 64px);
  background-color: #f4f4f4;
  .type-list {
    display: flex;
    align-items: center;
    margin: 20px 0;
    width: 100%;
    .item {
      flex: 1;
      margin: 0 10px;
      height: 40px;
      border-radius: 10px;
      background-color: skyblue;
      color: white;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      line-height: 40px;
      filter: grayscale(1);
      cursor: pointer;

      &.active {
        filter: grayscale(0);
      }
    }
  }
  .rank-list {
    width: 100%;

    .top {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-top: 100px;
      width: 100%;
      .item {
        position: relative;
        margin: 0 20px;
        width: 200px;
        height: 180px;
        border-radius: 15px;
        background-color: white;
        text-align: center;
        &.rank-1 {
          height: 200px;
          border-color: #ff6744;
          color: #ff6744;
          .rank {
            margin-top: 20px;
          }
        }
        &.rank-2 {
          border-color: #44d6ff;
          color: #44d6ff;
        }
        &.rank-3 {
          border-color: #ffb200;
          color: #ffb200;
        }

        .avatar {
          position: relative;
          margin-top: -50px;
          img {
            display: inline-block;
            margin: 0 auto;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: pink;
          }
        }

        .username {
          margin-bottom: 10px;
          font-size: 22px;
        }
        .rank {
          display: inline-block;
          padding: 0px 20px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 20px;
        }
      }
    }
    .top50-list {
      margin-top: 20px;
      border-radius: 10px;
      background-color: white;
      .top50-item {
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 40px;
        color: #666;
        &:nth-child(2n) {
          background-color: #fafbfc;
        }
        .rank {
          margin-right: 20px;
          padding: 0 20px;
          border-radius: 40px;
          background-color: #84f9da;
          color: white;
          font-size: 20px;
        }
        .left {
          display: flex;
          align-items: center;
          .avatar {
            margin-right: 10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: pink;
          }
          .username {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
