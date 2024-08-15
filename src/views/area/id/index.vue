<template>
  <div
    class="area-wrap"
    ref="topRef"
    :style="{ height: height + 'px' }"
  >
    <LongList
      ref="longListRef"
      class="list"
      @get-list-data="getListData"
      :rootMargin="{
        top: 0,
        bottom: 200,
        left: 0,
        right: 0,
      }"
    >
      <div
        v-for="(item, index) in liveRoomList"
        :key="index"
        class="item"
        @click="goRoom(item)"
      >
        <div
          class="cover"
          v-lazy:background-image="item?.cover_img || item?.users?.[0]?.avatar"
        >
          <PullAuthTip
            v-if="
              item?.pull_is_should_auth === LiveRoomPullIsShouldAuthEnum.yes
            "
          ></PullAuthTip>
          <div
            v-if="item?.live"
            class="living-ico"
          >
            直播中
          </div>
          <div
            v-if="
              item?.cdn === LiveRoomUseCDNEnum.yes ||
              [
                LiveRoomTypeEnum.tencent_css,
                LiveRoomTypeEnum.tencent_css_pk,
              ].includes(item.type!)
            "
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="txt">{{ item?.users?.[0]?.username }}</div>
        </div>
        <div class="desc">{{ item?.name }}</div>
      </div>
      <div v-if="loading"></div>
      <div
        v-else-if="!liveRoomList.length"
        class="null"
      >
        {{ t('common.nonedata') }}
      </div>
      <div
        v-else-if="!hasMore"
        class="null"
      >
        {{ t('common.allLoaded') }}
      </div>
    </LongList>
    <!-- <div
      class="paging-wrap"
      v-if="pageParams.total > pageParams.pageSize"
    >
      <n-pagination
        v-model:page="pageParams.nowPage"
        v-model:page-size="pageParams.pageSize"
        :item-count="pageParams.total"
        show-size-picker
        :page-sizes="[30, 50, 100, 200]"
        @update-page="getData"
        @update-page-size="handleUpdatePageSize"
      />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import LongList from '@/components/LongList/index.vue';
import router, { routerName } from '@/router';
import {
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomPullIsShouldAuthEnum,
  LiveRoomTypeEnum,
  LiveRoomUseCDNEnum,
} from '@/types/ILiveRoom';

const liveRoomList = ref<ILiveRoom[]>([]);
const { t } = useI18n();
const route = useRoute();

const longListRef = ref<InstanceType<typeof LongList>>();
const topRef = ref<HTMLDivElement>();
const height = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const pageParams = reactive({
  nowPage: 0,
  pageSize: 50,
});

watch(
  () => route.params.id,
  (newVal) => {
    if (!newVal) return;
    liveRoomList.value = [];
    pageParams.nowPage = 0;
    getData();
  }
);

function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: item.id },
  });
  openToTarget(url.href);
}

onMounted(() => {
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().top;
  }
  getData();
});

function getListData() {
  if (!hasMore.value) return;
  getData();
}

async function getData() {
  try {
    if (loading.value) return;
    loading.value = true;
    pageParams.nowPage += 1;
    if (longListRef.value) {
      longListRef.value.loading = true;
    }
    const res = await fetchLiveRoomList({
      id: Number(route.params.id),
      live_room_is_show: LiveRoomIsShowEnum.yes,
      nowPage: pageParams.nowPage,
      pageSize: pageParams.pageSize,
    });
    if (res.code === 200) {
      liveRoomList.value.push(...res.data.rows);
      hasMore.value = res.data.hasMore;
    }
  } catch (error) {
    pageParams.nowPage -= 1;
    console.log(error);
  }
  loading.value = false;
  if (longListRef.value) {
    longListRef.value.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.area-wrap {
  padding: 0 20px;

  .list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      display: inline-block;
      margin-right: 25px;
      margin-bottom: 12px;
      width: 300px;
      cursor: pointer;
      .cover {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 150px;
        border-radius: 8px;
        background-position: center center;
        background-size: cover;
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
          top: -10px;
          right: -10px;
          z-index: 2;
          width: 70px;
          height: 28px;
          background-color: #f87c48;
          color: white;
          transform: rotate(45deg);
          transform-origin: bottom;
          .txt {
            margin-left: 18px;
            background-image: initial !important;
            font-size: 13px;
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
    .null {
      width: 100%;
      text-align: center;
    }
  }
  .paging-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
