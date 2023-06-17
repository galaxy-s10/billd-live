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
    <div class="username">用户昵称：{{ userInfo?.username }}</div>
    <div class="live-room">
      直播间：{{ userInfo?.live_rooms?.[0]?.name || '未开通' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchFindUser } from '@/api/user';
import { IUser } from '@/interface';

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
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
}
</style>
