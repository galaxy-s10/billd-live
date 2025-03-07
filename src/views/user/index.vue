<template>
  <div
    v-loading="getUserLoading"
    class="profile-wrap"
  >
    <div class="uid">用户id：{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :url="userInfo?.avatar"
        :name="userInfo?.username"
        :size="30"
      ></Avatar>
    </div>
    <div>用户昵称：{{ userInfo?.username }}</div>
    <div>
      用户角色：{{ userInfo?.roles?.map((item) => item.role_name).join(',') }}
    </div>
    <div>注册时间：{{ userInfo?.created_at }}</div>
    <br />
    <div class="pull-url">
      <span
        v-if="
          !userInfo?.live_rooms?.length &&
          userStore.userInfo?.id === userInfo?.id
        "
        class="link"
        @click="openLiveRoom"
      >
        未开通
      </span>
      <span v-else-if="!userInfo?.live_rooms?.length">
        该用户未开通直播间
      </span>
      <div v-else>
        <div>
          直播间地址：
          <a
            :href="getLiveRoomPageUrl(userInfo?.live_rooms?.[0]?.id!)"
            class="link"
            target="_blank"
          >
            {{ getLiveRoomPageUrl(userInfo?.live_rooms?.[0]?.id!) }}
          </a>
        </div>
        <div>直播间标题：{{ userInfo?.live_rooms?.[0]?.title }}</div>
        <div>
          直播间简介：{{ userInfo?.live_rooms?.[0]?.desc || '暂无简介' }}
        </div>
        <div>
          直播间分区：{{
            userInfo.live_rooms[0]?.areas?.[0]?.name || '暂无分区'
          }}
        </div>
        <div>开通时间：{{ userInfo?.live_rooms?.[0]?.created_at }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchFindUser } from '@/api/user';
import { URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const userId = ref(-1);
const userInfo = ref<IUser>();
const getUserLoading = ref(false);

watchEffect(() => {
  if (route.params.id) {
    userId.value = Number(route.params.id as string);
    handleUserInfo();
  }
});

async function handleUserInfo() {
  try {
    getUserLoading.value = true;
    const res = await fetchFindUser(userId.value);
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUserLoading.value = false;
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
.profile-wrap {
  position: relative;
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
  .url-wrap {
    position: relative;
    margin-top: 10px;
    .cdn {
      margin-bottom: 10px;
    }
  }
}
</style>
