<template>
  <div class="profile-wrap">
    <div class="uid">用户id:{{ userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像:</span>
      <Avatar
        :avatar="userInfo?.avatar"
        :size="30"
      ></Avatar>
    </div>
    <div class="username">用户昵称:{{ userInfo?.username }}</div>
    <div class="pull-url">
      推流地址:{{ userInfo?.live_rooms?.[0].rtmp_url }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchUserInfo } from '@/api/user';
import { IUser } from '@/interface';

const userInfo = ref<IUser>();

async function handleUserInfo() {
  const res = await fetchUserInfo();
  if (res.code === 200) {
    userInfo.value = res.data;
  }
}

onMounted(() => {
  handleUserInfo();
});
</script>

<style lang="scss" scoped>
.profile-wrap {
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
