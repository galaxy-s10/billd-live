<template>
  <div class="h5-area-wrap">
    <div ref="topRef"></div>
    <div :style="{ height: height + 'px' }">
      <LongList
        :class="{
          list: 1,
        }"
        :status="status"
        ref="longListRef"
        @get-list-data="getListData"
      >
        <div
          v-for="(iten, indey) in liveRoomList"
          :key="indey"
          class="item"
          @click="goRoom(iten)"
        >
          <div
            class="cover"
            v-lazy:background-image="iten?.cover_img || iten?.users?.[0].avatar"
          >
            <div
              v-if="iten?.live"
              class="living-ico"
            >
              <div class="live-txt">直播中</div>
            </div>
            <div
              v-if="
                iten?.cdn === SwitchEnum.yes ||
                [
                  LiveRoomTypeEnum.tencent_css,
                  LiveRoomTypeEnum.tencent_css_pk,
                ].includes(iten.type!)
              "
              class="cdn-ico"
            >
              <div class="txt">CDN</div>
            </div>
            <div class="txt">{{ iten?.users?.[0]?.username }}</div>
          </div>
          <div class="desc">{{ iten?.name }}</div>
        </div>
      </LongList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import LongList from '@/components/LongList/index.vue';
import { SwitchEnum } from '@/interface';
import router, { routerName } from '@/router';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';

const route = useRoute();

const liveRoomList = ref<ILiveRoom[]>([]);
const topRef = ref<HTMLDivElement>();

const pageParams = reactive({
  nowPage: 0,
  pageSize: 50,
});
const height = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const longListRef = ref<InstanceType<typeof LongList>>();
const status = ref<'loading' | 'nonedata' | 'allLoaded' | 'normal'>('loading');

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
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().top;
  }
  getData();
});

function handleStatus() {
  if (loading.value) {
    status.value = 'loading';
  } else if (hasMore.value) {
    status.value = 'normal';
  } else {
    status.value = 'allLoaded';
  }
  if (!liveRoomList.value?.length) {
    status.value = 'nonedata';
  }
}

async function getData() {
  try {
    if (loading.value) return;
    loading.value = true;
    pageParams.nowPage += 1;
    status.value = 'loading';
    const res = await fetchLiveRoomList({
      id: Number(route.params.id),
      is_show: SwitchEnum.yes,
      ...pageParams,
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
  status.value = 'normal';
  status.value = 'normal';
  handleStatus();
}
function getListData() {
  if (!hasMore.value) return;
  getData();
}
</script>

<style lang="scss" scoped>
.h5-area-wrap {
  padding: 0 20px;

  .list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      display: inline-block;
      margin-bottom: 10px;
      width: 48%;
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
          padding: 0 6px;
          border-radius: 8px 0 10px;
          background-color: $theme-color-gold;
          color: white;
          text-align: center;
          font-size: 12px;
          .live-txt {
            transform-origin: center !important;

            @include minFont(10);
          }
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
    .null {
      width: 100%;
      text-align: center;
    }
  }
}
</style>
