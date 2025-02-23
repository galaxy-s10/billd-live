<template>
  <div class="h5-area-wrap">
    <div ref="topRef"></div>
    <div :style="{ height: height + 'px' }">
      <LongList
        ref="longListRef"
        :class="{
          list: 1,
        }"
        :status="status"
        @get-list-data="getListData"
      >
        <div
          v-for="(iten, indey) in liveRoomList"
          :key="indey"
        >
          <MobileLiveRoomItem
            :liveroom="iten"
            :user="iten?.users?.[0]"
            @click="goRoom(iten)"
          ></MobileLiveRoomItem>
        </div>
      </LongList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import { fetchLiveBilibiliGetUserRecommend } from '@/api/bilibili';
import LongList from '@/components/LongList/index.vue';
import { URL_QUERY } from '@/constant';
import { SwitchEnum } from '@/interface';
import router, { routerName } from '@/router';
import { ILiveRoom } from '@/types/ILiveRoom';

const route = useRoute();

const liveRoomList = ref<ILiveRoom[]>([]);
const topRef = ref<HTMLDivElement>();

const pageParams = reactive({
  nowPage: 0,
  pageSize: 20,
});
const height = ref(0);
const loading = ref(false);
const hasMore = ref(true);
const longListRef = ref<InstanceType<typeof LongList>>();
const status = ref<'loading' | 'nonedata' | 'allLoaded' | 'normal'>('loading');

function goRoom(item: ILiveRoom) {
  // @ts-ignore
  if (item.is_bilibili) {
    router.push({
      name: routerName.h5Room,
      params: { roomId: item.id },
      query: { [URL_QUERY.isBilibili]: 'true' },
    });
    return;
  }
  // if (!item.live) {
  //   window.$message.info('该直播间没在直播~');
  //   return;
  // }
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.id },
  });
}

async function handleBilibilData() {
  try {
    if (loading.value) return;
    loading.value = true;
    pageParams.nowPage += 1;
    status.value = 'loading';
    pageParams.nowPage += 1;
    const res = await fetchLiveBilibiliGetUserRecommend({
      page: pageParams.nowPage,
      page_size: pageParams.pageSize,
      platform: 'web',
    });
    const list = res?.data?.data?.list;
    if (list) {
      const arr = list.map((item) => {
        return {
          id: item.roomid,
          name: item.title,
          cover_img: item.cover,
          users: [{ username: item.uname }],
          is_bilibili: true,
          live: {},
          cdn: SwitchEnum.yes,
        };
      });
      hasMore.value = res.data.data.has_more === 1 ? true : false;
      liveRoomList.value.push(...arr);
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

onMounted(() => {
  if (topRef.value) {
    height.value =
      document.documentElement.clientHeight -
      topRef.value.getBoundingClientRect().top;
  }
  if (route.query[URL_QUERY.isBilibili] === 'true') {
    handleBilibilData();
  } else {
    getData();
  }
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
  if (route.query[URL_QUERY.isBilibili] === 'true') {
    handleBilibilData();
  } else {
    getData();
  }
}
</script>

<style lang="scss" scoped>
.h5-area-wrap {
  padding: 0 15px;

  .list {
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
