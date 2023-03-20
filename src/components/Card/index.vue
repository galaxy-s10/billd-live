<template>
  <div class="card-wrap">
    <div>Card组件</div>
    <div>pinia的counter: {{ counter }}</div>
    <BabyCpt></BabyCpt>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';

import BabyCpt from '@/components/Baby/index.vue';
import { useAppStore } from '@/store/app';

export default defineComponent({
  name: 'Card',
  components: { BabyCpt },
  setup() {
    const appStore = useAppStore();
    const counter = toRef(appStore, 'counter');

    return { counter };
  },
});
</script>

<style lang="scss" scoped>
.card-wrap {
  padding: 20px;
  background-color: pink;
}
</style>
