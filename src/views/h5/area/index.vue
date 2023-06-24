<template>
  <div class="h5-area-wrap">
    <div class="title">{{ route.query.name }}</div>
    <div class="live-room-list">
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchLiveRoomList } from '@/api/area';
import { ILiveRoom, liveTypeEnum } from '@/interface';
import router, { routerName } from '@/router';

const liveRoomList = ref<ILiveRoom[]>([]);

const route = useRoute();
function goRoom(item: ILiveRoom) {
  router.push({
    name: routerName.h5Room,
    params: { roomId: item.id },
    query: {
      liveType: liveTypeEnum.srsHlsPull,
    },
  });
}

onMounted(() => {
  getData();
});

async function getData() {
  const res = await fetchLiveRoomList({
    id: Number(route.params.areaId),
  });
  if (res.code === 200) {
    liveRoomList.value = res.data.rows;
  }
}
</script>

<style lang="scss" scoped>
.h5-area-wrap {
  padding: 0 20px;
  .title {
    margin-bottom: 10px;
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
</style>
