<template>
  <div
    class="modal-wrap"
    @click.self="maskClose"
  >
    <div class="container">
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
import { defineEmits, defineProps, useSlots } from 'vue';

const slots = useSlots();
const props = defineProps({
  modelValue: Boolean,
  hiddenClose: Boolean,
  maskClosable: Boolean,
  title: {
    type: String,
    default: '',
  },
});

function maskClose() {
  if (props.maskClosable) {
    emits('close');
  }
}

const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped>
.modal-wrap {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7) !important;

  @extend %maskBg;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    padding: 20px;
    width: 320px;
    height: 200px;
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
      width: 18px;
      height: 18px;
      cursor: pointer;

      @include cross(#ccc, 3px);
    }
    .content {
      margin-top: 10px;
    }
    .footer {
      position: absolute;
      right: 20px;
      bottom: 20px;
      left: 20px;

      .btn {
        width: 280px;
        height: 44px;
        border-radius: 100px;
        background: linear-gradient(270deg, #929dff 4.71%, #3cfdfd 103.24%),
          linear-gradient(270deg, #b3acff 4.71%, #3ccffd 103.24%),
          linear-gradient(270deg, #b3acff 4.71%, #3ccffd 103.24%);
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
