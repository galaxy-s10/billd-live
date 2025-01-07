<template>
  <div class="area-wrap">
    <div class="content-wrap">
      <div
        ref="topRef"
        class="tag-wrap"
      >
        <div
          class="tag"
          :class="{ active: areaId === 0 }"
          @click="changeArea(0)"
        >
          全部
        </div>
        <span
          v-for="(item, index) in appStore.areaList.find(
            (v) => v.id === pAreaId
          )?.children"
          :key="index"
          class="tag"
          :class="{ active: item.id === areaId }"
          @click="changeArea(item.id)"
        >
          {{ item.name }}
        </span>
      </div>

      <div
        v-if="height > 0"
        :style="{ height: height + 'px' }"
      >
        <LongList
          ref="longListRef"
          class="list"
          :rootMargin="{
            top: 0,
            bottom: 100,
            left: 0,
            right: 0,
          }"
          :status="status"
          @get-list-data="getListData"
        >
          <div
            v-for="(item, index) in liveRoomList"
            :key="index"
            @click="goRoom(item)"
          >
            <LiveRoomItem :liveroom="item"></LiveRoomItem>
          </div>
        </LongList>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import LongList from '@/components/LongList/index.vue';
import { SwitchEnum } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { ILiveRoom } from '@/types/ILiveRoom';

const liveRoomList = ref<ILiveRoom[]>([]);
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const status = ref<'loading' | 'nonedata' | 'allLoaded' | 'normal'>('loading');

const longListRef = ref<InstanceType<typeof LongList>>();
const topRef = ref<HTMLDivElement>();
const height = ref(-1);
const loading = ref(false);
const hasMore = ref(true);
const pageParams = reactive({
  nowPage: 0,
  pageSize: 50,
});

const areaId = ref(0);
const pAreaId = ref(0);

watch(
  () => route.params.p_area_id,
  (newVal) => {
    if (!newVal) return;
    pAreaId.value = Number(newVal);
    liveRoomList.value = [];
    pageParams.nowPage = 0;
    getData();
  }
);
watch(
  () => route.query.area_id,
  (newVal) => {
    if (!newVal) return;
    areaId.value = Number(newVal);
    liveRoomList.value = [];
    pageParams.nowPage = 0;
    getData();
  }
);

function changeArea(val) {
  router.push({ query: { area_id: val } });
}

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

function goRoom(item: ILiveRoom) {
  // if (!item.live) {
  //   window.$message.info('该直播间没在直播~');
  //   return;
  // }
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: item.id },
  });
  openToTarget(url.href);
}

onMounted(() => {
  getHeight();
  const urlAreaId = Number(route.query.area_id);
  const urlPAreaId = Number(route.params.p_area_id);
  if (urlAreaId) {
    areaId.value = urlAreaId;
  }
  if (urlPAreaId) {
    pAreaId.value = urlPAreaId;
  }
  getData();
});

function getHeight() {
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().bottom;
  }
}

function getListData() {
  if (!hasMore.value) return;
  getData();
}

async function getData() {
  try {
    if (loading.value) return;
    loading.value = true;
    status.value = 'loading';
    pageParams.nowPage += 1;
    const res = await fetchLiveRoomList({
      id: areaId.value || pAreaId.value,
      live_room_is_show: SwitchEnum.yes,
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
  status.value = 'normal';
  handleStatus();
}
</script>

<style lang="scss" scoped>
.area-wrap {
  box-sizing: border-box;
  padding-top: $header-height;
  width: 100vw;
  height: 100vh;
  background-color: #f1f2f3;
  .content-wrap {
    margin: 20px auto 0;
    width: $w-1500;
    .tag-wrap {
      box-sizing: border-box;
      padding: 0 40px 0 50px;
      width: calc($w-1500 - 50px);
      // background-color: red;
      .tag {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 2px 10px;
        border: 1px solid rgba($color: #999, $alpha: 0.3);
        border-radius: 10px;
        color: #61666d;
        font-size: 12px;
        cursor: pointer;
        &:hover {
          background-color: rgba($color: $theme-color-gold, $alpha: 0.1);
          color: #f9ca24;
        }
        &.active {
          border: 1px solid rgba($color: $theme-color-gold, $alpha: 2);
          background-color: $theme-color-gold;
          color: #fff;
        }
      }
    }

    .list {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      padding-top: 20px;
      padding-left: 40px;
      padding-right: 40px;

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
}
</style>
