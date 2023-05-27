<template>
  <div
    v-if="show"
    class="useTip-wrap"
  >
    <ModalCpt
      :title="title"
      :mask-closable="maskClosable"
      @close="show = !show"
    >
      <div class="container">
        <img
          class="qq-logo"
          src="@/assets/img/qq-logo.webp"
          alt=""
          @click="useQQLogin()"
        />
        <div>qq登录</div>
      </div>

      <template #footer></template>
    </ModalCpt>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import ModalCpt from '@/components/Modal/index.vue';
import { useQQLogin } from '@/hooks/use-login';

export default defineComponent({
  components: { ModalCpt },
  setup() {
    const title = ref('登录');
    const show = ref(false);
    const maskClosable = ref(true);
    return {
      title,
      show,
      maskClosable,
      useQQLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.useTip-wrap {
  .container {
    text-align: center;
    .qq-logo {
      cursor: pointer;
      width: 60px;
    }
  }
}
</style>
