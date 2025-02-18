<template>
  <div class="wrap">
    <div class="title">转推设置</div>

    <div
      v-if="!liveRoomInfo"
      class="card"
    >
      <span
        class="link"
        @click="openLiveRoom"
      >
        未开通直播间
      </span>
    </div>
    <template v-else>
      <div class="card">
        <div class="title">转推b站直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_bilibili_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_bilibili_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_bilibili_url')"
          >
            保存
          </div>
        </div>
      </div>
      <div class="card">
        <div class="title">转推虎牙直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_huya_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_huya_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_huya_url')"
          >
            保存
          </div>
        </div>
      </div>
      <div class="card">
        <div class="title">转推斗鱼直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_douyu_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_douyu_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_douyu_url')"
          >
            保存
          </div>
        </div>
      </div>
      <div class="card">
        <div class="title">转推抖音直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_douyin_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_douyin_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_douyin_url')"
          >
            保存
          </div>
        </div>
      </div>
      <div class="card">
        <div class="title">转推快手直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_kuaishou_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_kuaishou_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_kuaishou_url')"
          >
            保存
          </div>
        </div>
      </div>
      <div class="card">
        <div class="title">转推小红书直播</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="liveRoomInfo.forward_xiaohongshu_url"
              placeholder=""
              maxlength="500"
              show-count
              clearable
            />
          </div>
          <div
            class="save-btn"
            :class="{ active: liveRoomInfo.forward_xiaohongshu_url?.length }"
            @click="handleUpdateMyLiveRoom('forward_xiaohongshu_url')"
          >
            保存
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref, toRefs, watch } from 'vue';

import { fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getObj } from '@/utils';

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

async function handleUpdateMyLiveRoom(field: string) {
  if (!liveRoomInfo.value) {
    return;
  }
  if (!liveRoomInfo.value[field].length) {
    window.$message.warning('url不能为空！');
    return;
  }
  const res = await fetchUpdateMyLiveRoom(getObj(liveRoomInfo.value, [field]));

  if (res.code === 200) {
    window.$message.success('修改成功！');
  }
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
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .title {
      margin-bottom: 10px;
      font-size: 20px;
    }
    .ipt-wrap {
      display: flex;
      align-items: center;
      .ipt {
        width: 90%;
      }
      .save-btn {
        margin-left: 10px;
        width: 100px;
        height: 32px;
        border-radius: 4px;
        background-color: #e9eaec;
        color: #b4b4b4;
        text-align: center;
        text-align: center;
        font-size: 14px;
        line-height: 32px;
        cursor: pointer;
        &.active {
          background-color: $theme-color-gold;
          color: white;
        }
      }
    }
  }
}
</style>
