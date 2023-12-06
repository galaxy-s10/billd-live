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
    <br />
    <div class="pull-url">
      <span>直播间信息：</span>
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
          直播间地址：https://live.hsslive.cn/pull/{{
            userInfo?.live_rooms?.[0].id
          }}
        </div>
        <div
          v-loading="keyLoading"
          class="rtmp-url"
        >
          <span>
            推流地址：{{
              newRtmpUrl ||
              handleUrl({
                url: userInfo?.live_rooms?.[0].rtmp_url!,
                token: userInfo?.live_rooms?.[0].key!,
              })
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
import { SRS_CB_URL_PARAMS } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { IUser, LiveRoomTypeEnum } from '@/interface';
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
    newRtmpUrl.value ||
      handleUrl({
        url: userInfo.value?.live_rooms?.[0].rtmp_url!,
        token: userInfo.value?.live_rooms?.[0].key!,
      })
  );
  window.$message.success('复制成功！');
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: LiveRoomTypeEnum.user_srs },
  });
  openToTarget(url.href);
}

function handleUrl(data: { url: string; token: string }) {
  return `${data.url}?${SRS_CB_URL_PARAMS.publishKey}=${data.token}&${SRS_CB_URL_PARAMS.publishType}=${LiveRoomTypeEnum.user_obs}`;
}

async function handleUpdateKey() {
  try {
    keyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200) {
      const resUrl = handleUrl({ url: res.data.rtmp_url, token: res.data.key });
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
