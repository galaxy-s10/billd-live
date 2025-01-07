<template>
  <div class="wrap">
    <div class="title">个人信息</div>
    <div class="card">
      <div class="id">用户id：{{ userInfo?.id }}</div>
      <div class="avatar">
        <span class="txt">用户头像：</span>
        <Avatar
          :url="userInfo?.avatar"
          :name="userInfo?.username"
          :size="50"
        ></Avatar>
      </div>
      <div>用户昵称：{{ userInfo?.username }}</div>
      <div>
        用户角色：{{ userInfo?.roles?.map((item) => item.role_name).join(',') }}
      </div>
      <div>注册时间：{{ userInfo?.created_at }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
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
    min-height: 200px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .avatar {
      display: flex;
      align-items: center;
    }
  }
}
</style>
