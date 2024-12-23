<template>
  <div class="wrap">
    <div class="title">开播设置</div>
    <div
      v-if="liveRoomInfo"
      class="card-top"
    >
      <div class="avatar-wrap">
        <div
          v-if="userStore.userInfo?.avatar"
          class="avatar"
          :style="{
            backgroundImage: `url(${userStore.userInfo?.avatar})`,
          }"
        ></div>
        <div
          v-else
          class="avatar"
        ></div>
      </div>
      <div class="name-bar">
        <div class="name">{{ liveRoomInfo.name }}</div>
      </div>
      <div class="info-bar">
        <div class="item id">
          <span>
            直播间ID：<span class="val">{{ liveRoomInfo.id }}</span>
          </span>
          <span
            class="copy"
            @click="handleCopy(liveRoomInfo.id!)"
          >
            复制ID
          </span>
        </div>
        <div class="item url">
          <span>
            直播间链接：<span class="val">{{
              getLiveRoomPageUrl(liveRoomInfo.id!)
            }}</span>
          </span>
          <span
            class="copy"
            @click="handleCopy(getLiveRoomPageUrl(liveRoomInfo.id!))"
          >
            复制链接
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="liveRoomInfo"
      class="card"
    >
      <div>
        <div class="title">直播分区：</div>
        <div class="area-wrap">
          {{ liveRoomInfo.areas?.map((v) => v.name).join() }}
          <span class="save">修改分区</span>
        </div>
        <div class="title">房间标题：</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="title"
              placeholder=""
              maxlength="20"
              show-count
              clearable
            />
          </div>
          <span class="save">保存</span>
        </div>
        <div class="title">谁可以看：</div>
      </div>
    </div>
    <span
      v-else
      class="link"
      @click="openLiveRoom"
    >
      未开通
    </span>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { ref, toRefs, watch } from 'vue';

import { fetchUpdateLiveRoomKey, fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
const liveRoomInfo = ref<ILiveRoom>();
const updateKeyLoading = ref(false);
const title = ref('');

watch(
  () => userInfo?.value,
  (newval) => {
    const res = newval?.live_rooms?.[0];
    if (res) {
      liveRoomInfo.value = res;
      title.value = res.name || '';
    }
  },
  {
    immediate: true,
  }
);

// @ts-ignore
async function handleUpdateKey() {
  try {
    updateKeyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200 && liveRoomInfo) {
      // userStore.userInfo.live_rooms[0].push_obs_server =
      //   res.data.srsPushRes.obs_server;
      // userStore.userInfo.live_rooms[0].push_obs_stream_key =
      //   res.data.srsPushRes.obs_stream_key;
      // userStore.userInfo.live_rooms[0].push_rtmp_url =
      //   res.data.srsPushRes.rtmp_url;
      // userStore.userInfo.live_rooms[0].push_srt_url =
      //   res.data.srsPushRes.srt_url;
      // userStore.userInfo.live_rooms[0].push_webrtc_url =
      //   res.data.srsPushRes.webrtc_url;
      // userStore.userInfo.live_rooms[0].push_cdn_obs_server =
      //   res.data.cdnPushRes.obs_server;
      // userStore.userInfo.live_rooms[0].push_cdn_obs_stream_key =
      //   res.data.cdnPushRes.obs_stream_key;
      // userStore.userInfo.live_rooms[0].push_cdn_rtmp_url =
      //   res.data.cdnPushRes.rtmp_url;
      // userStore.userInfo.live_rooms[0].push_cdn_srt_url =
      //   res.data.cdnPushRes.srt_url;
      // userStore.userInfo.live_rooms[0].push_cdn_webrtc_url =
      //   res.data.cdnPushRes.webrtc_url;
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}

function handleCopy(url: string | number) {
  copyToClipBoard(`${url}`);
  window.$message.success('复制成功！');
}

// @ts-ignore
async function handleUpdateMyLiveRoom() {
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
  .card-top {
    position: relative;
    margin-top: 60px;
    margin-bottom: 20px;
    padding: 20px 30px;
    width: 50%;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;

    .avatar-wrap {
      position: absolute;
      top: -40px;
      left: 30px;
      width: 90px;
      height: 90px;
      border: 2px solid #ececec;
      border-radius: 50%;
      .avatar {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid white;
        border-radius: 50%;
        background-color: white;
        background-image: url('@/assets/img/default-avatar.png');

        @extend %containBg;
      }
    }
    .name-bar {
      box-sizing: border-box;
      padding-top: 10px;
      padding-bottom: 25px;
      padding-left: 105px;
      width: 100%;
      border-bottom: 1px solid #e3e8ec;
    }
    .info-bar {
      box-sizing: border-box;
      padding-top: 30px;
      width: 100%;
      font-size: 12px;
      .item {
        margin-bottom: 20px;
        .val {
          color: $theme-color-gold;
          font-size: 16px;
        }
        .copy {
          margin-left: 30px;
          color: $theme-color-gold;
          cursor: pointer;
        }
      }
    }
  }
  .card {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .link {
      color: $theme-color-gold;
      cursor: pointer;
    }
    .title {
      font-size: 20px;
    }
    .ipt-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .ipt {
        width: 300px;
        margin-right: 10px;
      }
      .save {
        color: #999;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .area-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .save {
        color: $theme-color-gold;
        font-size: 12px;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
}
</style>
