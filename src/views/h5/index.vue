<template>
  <div class="h5-wrap">
    <div
      class="swiper"
      :style="{ backgroundColor: currentSwiper.bg }"
    >
      {{ currentSwiper.txt }}
    </div>

    <!-- <div v-if="currentNav.id === appStore.mobileNav?.id"> -->
    <div class="type-list">
      <div
        v-for="(item, index) in liveRoomList"
        :key="index"
        class="item"
      >
        <div
          class="title"
          @click.stop
        >
          <div class="left">{{ item.name }}</div>
          <div
            class="right"
            @click="showAll(item)"
          >
            查看全部
          </div>
        </div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in item.area_live_rooms"
            :key="indey"
            class="live-room"
            @click="goRoom(iten)"
          >
            <div
              class="cover"
              :style="{
                backgroundImage: `url('${
                  iten.live_room?.cover_img || iten.live_room?.users?.[0].avatar
                }')`,
              }"
            >
              <div class="txt">{{ iten.live_room?.users?.[0].username }}</div>
            </div>
            <div class="desc">{{ iten.live_room?.name }}</div>
          </div>
          <div
            v-if="!item.area_live_rooms?.length"
            class="null"
          >
            暂无数据
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchAreaLiveRoomList } from '@/api/area';
import { IArea, IAreaLiveRoom, liveTypeEnum } from '@/interface';
import router, { mobileRouterName, routerName } from '@/router';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

const navList = ref([
  { id: 1, name: '频道' },
  { id: 2, name: '排行' },
  { id: 3, name: '我的' },
]);

const currentNav = ref(navList.value[0]);
const liveRoomList = ref<IArea[]>([]);

const swiperList = ref([
  { id: 1, txt: '广告位1', bg: '#FFCC70', url: '' },
  { id: 2, txt: '广告位2', bg: '#C850C0', url: '' },
  { id: 3, txt: '广告位3', bg: '#4158D0', url: '' },
]);
const timer = ref();
const currentSwiper = ref({ id: 1, txt: '广告位1', bg: '#FFCC70', url: '' });

async function getLiveRoomList() {
  try {
    const res = await fetchAreaLiveRoomList({
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  }
}

function showAll(item: IArea) {
  router.push({
    name: mobileRouterName.h5Area,
    params: { areaId: item.id },
    query: { name: item.name },
  });
}

function goRoom(item: IAreaLiveRoom) {
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.live_room_id },
    query: {
      liveType: liveTypeEnum.srsHlsPull,
    },
  });
}

onMounted(() => {
  getLiveRoomList();
  let num = 0;
  timer.value = setInterval(() => {
    num += 1;
    if (num > swiperList.value.length - 1) {
      num = 0;
    }
    currentSwiper.value = swiperList.value[num];
  }, 3000);
});
</script>

<style lang="scss" scoped>
.h5-wrap {
  background-color: #f4f4f4;
  .logo-bar {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    height: 40px;
    border-bottom: 1px solid #e7e7e7;
    background-color: white;
    .logo {
      width: 90px;
      height: 36px;

      @include setBackground('@/assets/img/logo-txt.png');
    }
  }
  .nav-list {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: white;
    line-height: 40px;
    .item {
      position: relative;
      margin: 0 20px;
      &.active {
        &::after {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 4px;
          background-color: $theme-color-gold;
          content: '';
        }
      }
    }
  }
  .swiper {
    width: 100%;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-size: 30px;
  }
  .type-list {
    .item {
      margin: 15px 0;
      padding: 15px;
      background-color: white;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .left {
        }
        .right {
          color: #999;
          font-size: 14px;
        }
      }
      .live-room-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        .live-room {
          display: inline-block;
          margin-bottom: 10px;
          width: 48%;
          .cover {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100px;
            border-radius: 8px;
            background-position: center center;
            background-size: cover;

            .txt {
              position: absolute;
              bottom: 0;
              left: 0;
              box-sizing: border-box;
              padding: 4px 8px;
              width: 100%;
              border-radius: 0 0 4px 4px;
              background-image: linear-gradient(
                -180deg,
                rgba(0, 0, 0, 0),
                rgba(0, 0, 0, 0.6)
              );
              color: white;
              text-align: initial;
              font-size: 13px;

              @extend %singleEllipsis;
            }
          }
          .desc {
            font-size: 14px;
            margin-top: 4px;
            @extend %singleEllipsis;
          }
        }
      }
    }
  }
}
</style>
