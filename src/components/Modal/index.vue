<template>
  <div
    class="modal-wrap"
    @click.self="maskClose"
  >
    <div
      class="container"
      :style="{ width }"
    >
      <span class="title">{{ props.title }}</span>
      <i
        v-if="!hiddenClose"
        class="close"
        @click="emits('close')"
      ></i>
      <div class="content">
        <slot></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
        <div
          v-if="!slots.footer"
          class="btn"
        >
          返回首页
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

const slots = useSlots();
const props = withDefaults(
  defineProps<{
    hiddenClose?: boolean;
    maskClosable?: boolean;
    title?: string;
    width?: string;
  }>(),
  {
    width: '320px',
  }
);

function maskClose() {
  if (props.maskClosable) {
    emits('close');
  }
}

const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped>
.modal-wrap {
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6) !important;

  @extend %maskBg;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    font-size: 14px;
    transform: translate(-50%, -50%);
    .title {
      font-weight: 700;
      font-size: 24px;
    }
    .close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.22, 0.58, 0.12, 0.98);

      @include cross(#999, 2px);
      &:hover {
        transform: rotate(180deg) scale(1.1);
      }
    }
    .content {
      margin: 15px 0;
    }
    .footer {
      .btn {
        width: 280px;
        height: 44px;
        border-radius: 100px;
        background: $theme-color-gold;
        color: white;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        line-height: 44px;
        cursor: pointer;
      }
    }
  }
}
</style>
