<template>
  <div class="area-wrap">
    <div
      v-loading="loading"
      class="live-room-list"
    >
      <div
        v-for="(iten, indey) in liveRoomList"
        :key="indey"
        class="live-room"
        @click="goRoom(iten)"
      >
        <div
          class="cover"
          :style="{
            backgroundImage: `url('${
              iten?.cover_img || iten?.users?.[0].avatar
            }')`,
          }"
        >
          <div
            v-if="iten?.cdn === 1"
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="txt">{{ iten?.users?.[0].username }}</div>
        </div>
        <div class="desc">{{ iten?.name }}</div>
      </div>
      <div
        v-if="!liveRoomList.length"
        class="null"
      >
        暂无数据
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import { ILiveRoom, LiveTypeEnum } from '@/interface';
import router, { routerName } from '@/router';

const liveRoomList = ref<ILiveRoom[]>([]);

const route = useRoute();

const loading = ref(false);

watch(
  () => route.params.id,
  (newVal) => {
    if (!newVal) return;
    getData();
  }
);

function goRoom(item: ILiveRoom) {
  if (!item.live) {
    window.$message.info('该直播间没在直播~');
    return;
  }
  router.push({
    name: routerName.pull,
    params: { roomId: item.id },
    query: {
      liveType: LiveTypeEnum.srsHlsPull,
    },
  });
}

onMounted(() => {
  getData();
});

async function getData() {
  try {
    loading.value = true;
    const res = await fetchLiveRoomList({
      id: Number(route.params.id),
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.area-wrap {
  padding: 15px 20px;
  .title {
    margin-bottom: 10px;
  }
  .live-room-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .live-room {
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
        .cdn-ico {
          position: absolute;
          right: -10px;
          top: -10px;
          background-color: #f87c48;
          color: white;
          z-index: 2;
          height: 28px;
          width: 70px;
          transform-origin: bottom;
          transform: rotate(45deg);
          .txt {
            margin-left: 18px;
            font-size: 13px;
            background-image: initial !important;
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
</style>
