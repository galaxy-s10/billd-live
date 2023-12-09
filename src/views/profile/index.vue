<template>
  <div
    v-loading="loading"
    class="profile-wrap"
  >
    <div class="uid">用户id：{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :avatar="userInfo?.avatar"
        :size="30"
      ></Avatar>
    </div>
    <div>用户昵称：{{ userInfo?.username }}</div>
    <br />
    <div>直播间信息：</div>
    <div v-if="userInfo?.live_rooms?.length">
      <div>
        直播间地址：
        <a
          :href="getLiveRoomPageUrl(userInfo?.live_rooms?.[0].id!)"
          class="link"
          target="_blank"
        >
          {{ getLiveRoomPageUrl(userInfo?.live_rooms?.[0].id!) }}
        </a>
      </div>
      <div>直播间名称：{{ userInfo.live_rooms[0].name }}</div>
      <div>直播间简介：{{ userInfo.live_rooms[0].desc }}</div>
      <div>
        直播间分区：{{ userInfo.live_rooms[0].areas?.[0].name || '暂无分区' }}
      </div>
    </div>
    <span v-else>未开通</span>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchFindUser } from '@/api/user';
import { IUser } from '@/interface';
import { getLiveRoomPageUrl } from '@/utils';

const loading = ref(false);
const route = useRoute();
const userInfo = ref<IUser>();

async function handleUserInfo() {
  try {
    loading.value = true;
    const res = await fetchFindUser(Number(route.params.userId as string));
    if (res.code === 200) {
      userInfo.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  handleUserInfo();
});
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
}
</style>
