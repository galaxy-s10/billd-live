<template>
  <div class="wrap">
    <div class="title">转推设置</div>

    <div class="card">
      <div class="title">转推b站直播</div>
      <div class="ipt-wrap">
        <div class="ipt">
          <n-input
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
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
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
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
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
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
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
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
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
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
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="500"
            show-count
            clearable
          />
        </div>
        <div
          class="save-btn"
          :class="{ active: noticeMsg.length }"
          @click="handleUpdateMyLiveRoomNotice"
        >
          保存
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue';

import { fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { useUserStore } from '@/store/user';
import { ILiveRoom } from '@/types/ILiveRoom';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
const liveRoomInfo = ref<ILiveRoom>();
const title = ref('');
const noticeMsg = ref('');
const coverImg = ref('');

watch(
  () => userInfo?.value,
  (newval) => {
    const res = newval?.live_rooms?.[0];
    if (res) {
      liveRoomInfo.value = res;
      title.value = res.name || '';
      noticeMsg.value = res.notice_msg || '';
      coverImg.value = res.cover_img || '';
    }
  },
  {
    immediate: true,
  }
);

async function handleUpdateMyLiveRoomNotice() {
  if (!noticeMsg.value.length) {
    window.$message.warning('公告不能为空！');
    return;
  }
  const res = await fetchUpdateMyLiveRoom({
    forward_bilibili_url: liveRoomInfo.value?.forward_bilibili_url,
    forward_douyin_url: liveRoomInfo.value?.forward_douyin_url,
    forward_douyu_url: liveRoomInfo.value?.forward_douyu_url,
    forward_huya_url: liveRoomInfo.value?.forward_huya_url,
    forward_kuaishou_url: liveRoomInfo.value?.forward_kuaishou_url,
    forward_xiaohongshu_url: liveRoomInfo.value?.forward_xiaohongshu_url,
  });

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
