<template>
  <div class="home-wrap">
    <h1>home页面</h1>
    <div>pinia的user: {{ userDetail }}</div>
    <div>pinia的counter: {{ counter }}</div>
    <button @click="handlecounter">设置counter</button>
    <button @click="handleInfo(1)">模拟异步请求成功</button>
    <button @click="handleInfo(2)">模拟异步请求失败</button>
    <CardCpt></CardCpt>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, ref } from 'vue';

import CardCpt from '@/components/Card/index.vue';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

export default defineComponent({
  components: { CardCpt },
  setup() {
    const userStore = useUserStore();
    const appStore = useAppStore();
    const userInfo = ref(userStore);
    const userDetail = toRef(userStore, 'detail');
    const counter = toRef(appStore, 'counter');
    const handlecounter = () => {
      appStore.setCounter((counter.value += 1));
    };
    const handleInfo = (num) => {
      userStore.setDetail(num).then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    };

    return { userInfo, userDetail, counter, handlecounter, handleInfo };
  },
});
</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 20px;
  background-color: skyblue;
}
</style>
