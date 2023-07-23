<template>
  <div class="profile-wrap">
    <div class="uid">用户id：{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :avatar="userInfo?.avatar"
        :size="30"
      ></Avatar>
    </div>
    <div class="username">用户昵称：{{ userInfo?.username }}</div>
    <div class="pull-url">
      <span>直播间：</span>
      <span
        v-if="!userInfo?.live_rooms?.length"
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
      <div v-else>
        <div>直播间名字：{{ userInfo?.live_rooms?.[0].name }}</div>
        <div>
          直播间地址1(webrtc开播时)：https://live.hsslive.cn/pull/<span>
            {{ userInfo?.live_rooms?.[0].id }}?liveType=webrtcPull
          </span>
        </div>
        <div>
          直播间地址2(srs-webrtc开播时)：https://live.hsslive.cn/pull/<span>
            {{ userInfo?.live_rooms?.[0].id }}?liveType=srsWebrtcPull
          </span>
        </div>
        <div>
          直播间地址3(srs-webrtc开播或obs推流时)：https://live.hsslive.cn/pull/<span>
            {{ userInfo?.live_rooms?.[0].id }}?liveType=srsFlvPull
          </span>
        </div>
        <div
          v-loading="keyLoading"
          class="rtmp-url"
        >
          <span>
            推流地址：{{
              newRtmpUrl || handleUrl(userInfo?.live_rooms?.[0].rtmp_url!)
            }}，
          </span>
          <span
            class="link"
            @click="handleCopy"
          >
            复制
          </span>
          <span>，</span>
          <span
            class="link"
            @click="handleUpdateKey"
          >
            更新
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchUpdateLiveRoomKey } from '@/api/liveRoom';
import { fetchUserInfo } from '@/api/user';
import { loginTip } from '@/hooks/use-login';
import { IUser, LiveRoomTypeEnum, liveTypeEnum } from '@/interface';
import { routerName } from '@/router';

const newRtmpUrl = ref();
const keyLoading = ref(false);
const router = useRouter();

const userInfo = ref<IUser>();

async function handleUserInfo() {
  const res = await fetchUserInfo();
  if (res.code === 200) {
    userInfo.value = res.data;
  }
}

function handleCopy() {
  copyToClipBoard(
    newRtmpUrl.value || handleUrl(userInfo.value?.live_rooms?.[0].rtmp_url!)
  );
  window.$message.success('复制成功！');
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: liveTypeEnum.srsWebrtcPull },
  });
  openToTarget(url.href);
}

function handleUrl(rtmpUrl: string) {
  let resUrl = '';
  if (rtmpUrl.indexOf('type=') === -1) {
    resUrl += `${rtmpUrl}&type=${LiveRoomTypeEnum.user_obs}`;
  } else {
    resUrl = rtmpUrl.replace(
      /type=([0-9]+)/,
      `type=${LiveRoomTypeEnum.user_obs}`
    );
  }
  return resUrl;
}

async function handleUpdateKey() {
  try {
    keyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200) {
      const resUrl = handleUrl(res.data.rtmp_url as string);
      newRtmpUrl.value = resUrl;
    }
  } catch (error) {
    console.log(error);
  } finally {
    keyLoading.value = false;
  }
}

onMounted(() => {
  handleUserInfo();
});
</script>

<style lang="scss" scoped>
.profile-wrap {
  padding: 10px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
  .rtmp-url {
    position: relative;
  }
}
</style>
