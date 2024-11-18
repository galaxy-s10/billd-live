<template>
  <div
    v-show="loading"
    :class="{ 'full-loading-wrap': 1, [isFixed ? 'fixed' : 'absolute']: 1 }"
    :style="{ zIndex: zindex || normalZindex }"
  >
    <div>
      <div
        v-if="mask"
        class="mask"
      ></div>
      <div
        class="container"
        :style="{ '--loading-size': loadingSize + 'px' }"
      ></div>
      <div
        v-if="content && content !== ''"
        class="txt"
        :style="{ color: contentColor }"
      >
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const isFixed = ref(false);
    const loading = ref(false);
    const mask = ref(false);
    const normalZindex = ref(10);
    const loadingSize = ref(30);
    const zindex = ref(normalZindex);
    const content = ref('');
    const contentColor = ref('#999');
    return {
      content,
      contentColor,
      loading,
      isFixed,
      mask,
      zindex,
      normalZindex,
      loadingSize,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'billd-scss/src/animate/loading-size.scss';

.full-loading-wrap {
  @extend %flexCenter;
  &.fixed {
    @include full(fixed);
  }
  &.absolute {
    @include full(absolute);
  }
  .mask {
    position: absolute !important;
    background-color: rgba($color: #000000, $alpha: 0.2) !important;

    @extend %maskBg;
  }
  .container {
    @include loadingSizeChange(var(--loading-size), $theme-color-gold);
  }
  .txt {
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
