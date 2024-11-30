<template>
  <div class="h5-wrap">
    <div
      class="swiper"
      :style="{
        backgroundImage: `url(${currentSwiper.bgi})`,
      }"
      @click="openToTarget(currentSwiper.url)"
    >
      <!-- {{ currentSwiper.txt }} -->
    </div>

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
            v-for="(iten, indey) in item.live_rooms"
            :key="indey"
            class="live-room"
            @click="goRoom(iten)"
          >
            <div
              class="cover"
              v-lazy:background-image="iten?.cover_img || iten?.user?.avatar"
            >
              <PullAuthTip
                v-if="
                  iten?.pull_is_should_auth === LiveRoomPullIsShouldAuthEnum.yes
                "
              ></PullAuthTip>
              <div
                v-if="iten?.live"
                class="living-ico"
              >
                直播中
              </div>
              <div
                v-if="
                  iten?.cdn === LiveRoomUseCDNEnum.yes ||
                  [
                    LiveRoomTypeEnum.tencent_css,
                    LiveRoomTypeEnum.tencent_css_pk,
                  ].includes(iten?.type!)
                "
                class="cdn-ico"
              >
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ iten?.users?.[0].username }}</div>
            </div>
            <div class="desc">{{ iten?.name }}</div>
          </div>
          <div
            v-if="!item.live_rooms?.length"
            class="null"
          >
            {{ t('common.nonedata') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { fetchAreaLiveRoomList } from '@/api/area';
import { COMMON_URL } from '@/constant';
import { IArea } from '@/interface';
import router, { mobileRouterName, routerName } from '@/router';
import { useAppStore } from '@/store/app';
import {
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomPullIsShouldAuthEnum,
  LiveRoomStatusEnum,
  LiveRoomTypeEnum,
  LiveRoomUseCDNEnum,
} from '@/types/ILiveRoom';

const appStore = useAppStore();
const liveRoomList = ref<IArea[]>([]);
const { t } = useI18n();

const swiperList = ref([
  {
    id: 1,
    txt: '广告位1',
    bgi: `https://resource.hsslive.cn/billd-live/image/aa51fe9093c4c6887931d5e9224f0f07.webp`,
    url: COMMON_URL.payCoursesArticle,
  },
  {
    id: 1,
    txt: '广告位2',
    bgi: `https://resource.hsslive.cn/billd-live/image/1d62827adb3f0575cf3138811aeed4f2.png`,
    url: 'https://github.com/galaxy-s10/billd-live',
  },
]);
const swiperTimer = ref();
const currentSwiper = ref(swiperList.value[0]);

async function getLiveRoomList() {
  try {
    const res = await fetchAreaLiveRoomList({
      is_show: LiveRoomIsShowEnum.yes,
      status: LiveRoomStatusEnum.normal,
      // is_fake: 2,
      // cdn: LiveRoomUseCDNEnum.yes,
      // id: 2,
      orderName: 'priority',
      orderBy: 'desc',
      nowPage: 1,
      pageSize: 10,
      childPageSize: 4,
      childNowPage: 1,
      childOrderName: 'priority',
      childOrderBy: 'desc',
      // childKeyWord: '',
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
    params: { id: item.id },
  });
}

function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.id },
  });
}

onMounted(() => {
  getLiveRoomList();
  let num = 0;
  swiperTimer.value = setInterval(() => {
    num += 1;
    if (num > swiperList.value.length - 1) {
      num = 0;
    }
    currentSwiper.value = swiperList.value[num];
  }, 3000);
});

onUnmounted(() => {
  clearInterval(swiperTimer.value);
  appStore.showLoginModal = false;
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
    height: 180px;
    // background-size: cover;
    // background-repeat: no-repeat;
    // background-position: center center;

    @extend %coverBg;
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
          height: 130px;

          .cover {
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100px;
            border-radius: 8px;

            @extend %containBg;

            .living-ico {
              position: absolute;
              top: 0px;
              left: 0px;
              z-index: 10;
              padding: 0 10px;
              height: 20px;
              border-radius: 8px 0 10px;
              background-color: $theme-color-gold;
              color: white;
              text-align: center;
              font-size: 12px;
              line-height: 20px;
            }
            .cdn-ico {
              position: absolute;
              top: -12px;
              right: -12px;
              z-index: 2;
              width: 70px;
              height: 22px;
              background-color: #f87c48;
              transform: rotate(45deg);
              transform-origin: bottom;

              .txt {
                margin-left: 18px;
                background-image: initial !important;
                color: white;
                font-size: 10px;
                transform: scale(0.83333) translate(2px, 3px);
              }
            }

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
            margin-top: 4px;
            font-size: 14px;

            @extend %singleEllipsis;
          }
        }
      }
    }
  }
}
</style>
