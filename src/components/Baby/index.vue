<template>
  <div class="baby-wrap">
    <div>Baby组件</div>
    <div>pinia的counter: {{ counter }}</div>

    <button @click="handlecounter">设置counter</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';

import { useAppStore } from '@/store/app';

export default defineComponent({
  components: {},
  setup() {
    const appStore = useAppStore();
    const counter = toRef(appStore, 'counter');
    const handlecounter = () => {
      appStore.setCounter((counter.value += 1));
    };

    return { counter, handlecounter };
  },
});
</script>

<style lang="scss" scoped>
.baby-wrap {
  padding: 20px;
  background-color: orchid;
}
</style>
