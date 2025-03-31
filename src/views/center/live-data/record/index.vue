<template>
  <div class="wrap">
    <div class="title">场次数据</div>
    <div class="card">
      <div class="table">
        <div
          v-for="(item, index) in column"
          :key="index"
          class="item top"
        >
          <div class="start-time">{{ item.start_time }}</div>
          <div class="area-name">{{ item.area_name }}</div>
          <div class="duration">{{ item.duration }}</div>
          <div class="view">{{ item.view }}</div>
          <div class="danmu">{{ item.danmu }}</div>
          <div class="end-time">{{ item.end_time }}</div>
        </div>
      </div>
      <div class="table height">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="item"
        >
          <div class="start-time">{{ item.start_time }}</div>
          <div class="area-name">
            <span v-if="item.area_name">{{ item.area_name }}</span>
          </div>
          <div class="duration">{{ convertToTime(item.duration || 0) }}</div>
          <div class="view">{{ item.view }}</div>
          <div class="danmu">{{ item.danmu }}</div>
          <div class="end-time">{{ item.end_time || '-' }}</div>
        </div>
      </div>
      <div class="paging">
        <n-pagination
          v-model:page="params.nowPage"
          :page-size="params.pageSize"
          :item-count="total"
          @update-page="handleUpdatePage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchLiveRecordMyList } from '@/api/liveRecord';
import { ILiveRecord } from '@/interface';
import { convertToTime } from '@/utils';

const params = ref<{
  orderName: string;
  orderBy: string;
  nowPage: number;
  pageSize: number;
}>({
  nowPage: 1,
  pageSize: 20,
  orderBy: 'desc',
  orderName: 'start_time',
});

const total = ref(0);

const column = [
  {
    start_time: '开播时间',
    area_name: '直播分区',
    end_time: '下播时间',
    duration: '直播时长',
    view: '观看次数',
    danmu: '弹幕数',
  },
];

const list = ref<ILiveRecord[]>([]);

onMounted(() => {
  getList();
});

// function handleAreaName(item) {
//   const res = findDataById({
//     rows: appStore.flatAreaList,
//     targetId: item.area_id,
//   });
//   if (res.parent) {
//     return `${res.parent.name} · ${res.target.name}`;
//   } else {
//     return `${res.target.name}`;
//   }
// }

async function handleUpdatePage(v) {
  params.value.nowPage = v;
  await getList();
}

async function getList() {
  try {
    const res = await fetchLiveRecordMyList(params.value);
    if (res.code === 200) {
      list.value = res.data.rows;
      total.value = res.data.total;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  .title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  .card {
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    // height: 200px;
    padding: 20px;
    .table {
      position: relative;
      overflow: scroll;
      margin-top: 10px;
      width: 100%;

      // @extend %customScrollbarHide;
      // &:hover {
      @extend %customScrollbar;
      // }
      &.height {
        margin-top: 0;
        height: 350px;
      }
      .list {
        overflow: scroll;
      }

      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 16px;
        height: 44px;
        border-bottom: 1px solid #e4e4e4;
        // border-radius: 4px;
        background-color: #fafafa;
        color: #242833;
        text-align: center;
        font-size: 12px;
        &.top {
          border-bottom: 1px solid transparent;
          background-color: #f2f2f4 !important;
        }

        &:nth-child(2n) {
          background-color: #ededed;
        }
        // &:hover {
        //   background-color: #ededed;
        // }

        .start-time {
          width: 200px;
          text-align: center;
        }

        .area-name {
          width: 180px;
          text-align: center;
        }
        .end-time {
          width: 200px;
          text-align: center;
        }
        .duration {
          width: 100px;
          text-align: center;
        }
        .view {
          width: 100px;
        }
        .danmu {
          width: 100px;
        }
      }
    }
    .paging {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
