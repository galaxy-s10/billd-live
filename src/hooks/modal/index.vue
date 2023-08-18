<template>
  <div
    v-if="show"
    class="useTip-wrap"
  >
    <ModalCpt
      :title="title"
      :mask-closable="maskClosable"
      @close="handleCancel()"
    >
      {{ msg }}
      <template #footer>
        <div class="footer">
          <div
            v-if="!hiddenCancel"
            class="btn return"
            @click="handleCancel()"
          >
            取消
          </div>
          <div
            :class="{ btn: 1, next: 1, hiddenCancel }"
            @click="handleOk()"
          >
            确认
          </div>
        </div>
      </template>
    </ModalCpt>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import ModalCpt from '@/components/Modal/index.vue';

export default defineComponent({
  components: { ModalCpt },
  emits: ['ok', 'cancel'],
  setup() {
    const title = ref('提示');
    const msg = ref('');
    const show = ref(false);
    const hiddenCancel = ref(false);
    const hiddenClose = ref(false);
    const maskClosable = ref(true);
    function handleCancel(cb?) {
      cb?.();
    }
    function handleOk(cb?) {
      cb?.();
    }
    return {
      title,
      msg,
      show,
      hiddenCancel,
      hiddenClose,
      maskClosable,
      handleCancel,
      handleOk,
    };
  },
});
</script>

<style lang="scss" scoped>
.useTip-wrap {
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      box-sizing: border-box;
      width: 130px;
      height: 44px;
      border-radius: 100px;
      text-align: center;
      line-height: 44px;
      cursor: pointer;

      user-select: none;

      &.return {
        border: 1px solid rgba(153, 153, 153, 0.3);
        background: #ffffff;
        color: #666;
        font-size: 14px;
      }
      &.next {
        background: #fceabb; /* fallback for old browsers */
        background: -webkit-linear-gradient(
          to left,
          #f8b500,
          #fceabb
        ); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(
          to left,
          #f8b500,
          #fceabb
        ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        color: white;
        font-weight: 700;
        font-size: 16px;
        &.hiddenCancel {
          width: 100%;
        }
      }
    }
  }
}
</style>
