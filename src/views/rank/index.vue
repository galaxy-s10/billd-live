<template>
  <div class="rank-wrap">
    <div class="type-list">
      <div
        v-for="(item, index) in rankTypeList"
        :key="index"
        :class="{ item: 1, active: item.type === currRankType }"
        @click="changeCurrRankType(item.type)"
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
          <div
            class="avatar"
            @click="
              currRankType !== RankTypeEnum.blog &&
                router.push({
                  name: routerName.profile,
                  params: { userId: item.user.id },
                })
            "
          >
            <Avatar
              :size="100"
              :avatar="item.user.avatar"
              :living="!!item.live?.live"
            ></Avatar>
          </div>
          <div class="username">{{ item.user.username }}</div>
          <div class="rank">
            <i>0{{ item.rank }}</i>
            <div
              v-if="item.live?.live && currRankType === RankTypeEnum.liveRoom"
              class="living"
              @click="handleJoin(item.live)"
            >
              直播中
            </div>
          </div>
          <div v-if="item.balance && currRankType === RankTypeEnum.wallet">
            钱包：{{ item.balance }}
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
            <i>{{ item.rank >= 10 ? item.rank : '0' + item.rank }}</i>
          </div>
          <div class="left">
            <img
              :src="item.user.avatar"
              class="avatar"
              alt=""
            />
            <div class="username">{{ item.user.username }}</div>
            <div class="wallet">
              <div v-if="currRankType === RankTypeEnum.wallet">
                （钱包：{{ item.balance }}）
              </div>
            </div>
            <div
              v-if="item.live?.live && currRankType === RankTypeEnum.liveRoom"
              class="living-tag"
              @click="handleJoin(item.live)"
            >
              直播中
            </div>
          </div>
          <div class="right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchLiveRoomList } from '@/api/liveRoom';
import { fetchBlogUserList, fetchUserList } from '@/api/user';
import { fetchWalletList } from '@/api/wallet';
import { fullLoading } from '@/components/FullLoading';
import { ILiveRoom, IUser, RankTypeEnum } from '@/interface';
import router, { routerName } from '@/router';

export interface IRankType {
  type: RankTypeEnum;
  label: string;
}

const rankTypeList = ref<IRankType[]>([
  {
    type: RankTypeEnum.liveRoom,
    label: '直播榜',
  },
  {
    type: RankTypeEnum.user,
    label: '用户榜',
  },
  {
    type: RankTypeEnum.wallet,
    label: '土豪榜',
  },
  {
    type: RankTypeEnum.blog,
    label: '博客用户',
  },
]);

const mockDataNums = 4;

const currRankType = ref(RankTypeEnum.liveRoom);

const mockRank: {
  user: IUser;
  rank: number;
  level: number;
  score: number;
  balance: string;
  live?: ILiveRoom;
}[] = [
  {
    user: {
      id: -1,
      username: '待上榜',
      avatar: '',
    },
    rank: 1,
    level: -1,
    score: -1,
    balance: '0.00',
    live: undefined,
  },
  {
    user: {
      id: -1,
      username: '待上榜',
      avatar: '',
    },
    rank: 2,
    level: -1,
    score: -1,
    balance: '0.00',
    live: undefined,
  },
  {
    user: {
      id: -1,
      username: '待上榜',
      avatar: '',
    },
    rank: 3,
    level: -1,
    score: -1,
    balance: '0.00',
    live: undefined,
  },
  {
    user: {
      id: -1,
      username: '待上榜',
      avatar: '',
    },
    rank: 4,
    level: -1,
    score: -1,
    balance: '0.00',
    live: undefined,
  },
];
const rankList = ref(mockRank);

function handleJoin(item) {
  router.push({
    name: routerName.pull,
    params: { roomId: item.live.live_room_id },
  });
}

async function getWalletList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchWalletList({});
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          user: item.user,
          rank: index + 1,
          level: 1,
          score: 1,
          balance: item.balance,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    fullLoading({ loading: false });
  }
}

async function getLiveRoomList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchLiveRoomList({
      orderName: 'updated_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          user: {
            id: item.user_id!,
            username: item.user_username!,
            avatar: item.user_avatar!,
          },
          live: item,
          rank: index + 1,
          level: 1,
          score: 1,
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    fullLoading({ loading: false });
  }
}

async function getUserList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchUserList({
      orderName: 'updated_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          user: {
            id: item.id!,
            username: item.username!,
            avatar: item.avatar!,
          },
          rank: index + 1,
          level: 1,
          score: 1,
          balance: '',
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    fullLoading({ loading: false });
  }
}
async function getBlogUserList() {
  try {
    fullLoading({ loading: true });
    const res = await fetchBlogUserList({
      orderName: 'updated_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      const length = res.data.rows.length;
      rankList.value = res.data.rows.map((item, index) => {
        return {
          user: {
            id: item.id!,
            username: item.username!,
            avatar: item.avatar!,
          },
          rank: index + 1,
          level: 1,
          score: 1,
          balance: '',
        };
      });
      if (length < mockDataNums) {
        rankList.value.push(...mockRank.slice(length));
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    fullLoading({ loading: false });
  }
}

function changeCurrRankType(type: RankTypeEnum) {
  currRankType.value = type;
  switch (type) {
    case RankTypeEnum.liveRoom:
      getLiveRoomList();
      break;
    case RankTypeEnum.user:
      getUserList();
      break;
    case RankTypeEnum.blog:
      getBlogUserList();
      break;
    case RankTypeEnum.wallet:
      getWalletList();
      break;
    default:
      break;
  }
}

onMounted(() => {
  changeCurrRankType(currRankType.value);
});
</script>

<style lang="scss" scoped>
.rank-wrap {
  box-sizing: border-box;
  padding-top: 10px;
  height: calc(100vh - $header-height);
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
      background-color: $theme-color-gold;
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

    .living-tag {
      display: inline-block;
      margin: 0 auto;
      padding: 2px 5px;
      width: 40px;
      border: 1px solid $theme-color-gold;
      border-radius: 10px;
      color: $theme-color-gold;
      text-align: center;
      font-size: 12px;
      line-height: 1.2;
      cursor: pointer;
    }

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
          .avatar-wrap {
            .avatar {
              border: 2px solid #ff6744;
            }
          }
        }
        &.rank-2 {
          border-color: #44d6ff;
          color: #44d6ff;
          .avatar-wrap {
            .avatar {
              border: 2px solid #44d6ff;
            }
          }
        }
        &.rank-3 {
          border-color: #ffb200;
          color: #ffb200;
          .avatar-wrap {
            .avatar {
              border: 2px solid #ffb200;
            }
          }
        }

        .avatar {
          margin-top: -50px;
          display: inline-block;
          cursor: pointer;
        }

        .username {
          margin-bottom: 10px;
          font-size: 22px;
        }

        .rank {
          position: relative;
          display: inline-block;
          padding: 0px 20px;
          border: 1px solid;
          border-radius: 20px;
          font-size: 20px;
          .living {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 130%);

            @extend .living-tag;
          }
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
          box-sizing: border-box;
          margin-right: 20px;
          width: 80px;
          border-radius: 40px;
          background-color: #84f9da;
          color: white;
          text-align: center;
          font-size: 20px;
        }
        .left {
          display: flex;
          align-items: center;
          font-size: 12px;

          .avatar {
            margin-right: 10px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
          .username {
            width: 100px;

            @extend %singleEllipsis;
          }
          .wallet {
            margin-left: 4px;
          }
        }
      }
    }
  }
}
</style>
