<template>
  <div class="wrap">
    <div class="title">直播间信息</div>
    <div class="card">
      <template v-if="liveRoomInfo">
        <div class="item">
          直播间ID：
          <a
            :href="getLiveRoomPageUrl(liveRoomInfo.id!)"
            class="link"
            target="_blank"
          >
            {{ liveRoomInfo.id }}
          </a>
        </div>
        <div class="item">直播间名称：{{ liveRoomInfo.name }}</div>
        <div class="item">
          直播间简介：{{ liveRoomInfo.desc || '暂无简介' }}
        </div>
        <div class="item">
          直播间分区：{{ liveRoomInfo.areas?.[0]?.name || '暂无分区' }}
        </div>
        <div class="item">
          开通时间：{{ liveRoomInfo.created_at }}
        </div></template
      >
      <span
        v-else
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref, toRefs, watch } from 'vue';

import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
const liveRoomInfo = ref<ILiveRoom>();

watch(
  () => userInfo?.value,
  (newval) => {
    const res = newval?.live_rooms?.[0];
    if (res) {
      liveRoomInfo.value = res;
    }
  },
  {
    immediate: true,
  }
);

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { [URL_QUERY.liveType]: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.wrap {
  .title {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  .card {
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .link {
      color: $theme-color-gold;
      text-decoration: none;
      cursor: pointer;
    }
    .item {
      margin-bottom: 10px;
    }
  }
}
</style>
