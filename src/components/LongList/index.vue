<template>
  <div
    ref="longListRef"
    class="long-list-wrap"
  >
    <!-- <div
      style="
        position: fixed;
        bottom: 10px;
        left: 10px;
        z-index: 999;
        color: red;
      "
    >
      {{ status }}
    </div> -->
    <slot></slot>
    <div
      v-if="status === 'loading'"
      class="loading"
    >
      {{ t('common.loading') }}
    </div>
    <div
      v-if="status === 'nonedata'"
      class="loading"
    >
      {{ t('common.nonedata') }}
    </div>
    <div
      v-if="status === 'allLoaded'"
      class="loading"
    >
      {{ t('common.allLoaded') }}
    </div>
    <div ref="bottomRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const longListRef = ref<HTMLElement>();
const bottomRef = ref<any>();
const intersectionObserver = ref<IntersectionObserver>();

const { t } = useI18n();

defineExpose({
  longListRef,
});

const props = withDefaults(
  defineProps<{
    rootMargin?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    status: 'loading' | 'nonedata' | 'allLoaded' | 'normal';
  }>(),
  {
    rootMargin: () => {
      return { top: 0, right: 0, bottom: 100, left: 0 };
    },
  }
);

const emits = defineEmits(['getListData']);

function monitTouchBottom() {
  // 距离底部50px就开始加载下一页
  const rootMargin = {
    bottom: props.rootMargin.bottom,
    top: props.rootMargin.top,
    left: props.rootMargin.left,
    right: props.rootMargin.right,
  };
  intersectionObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          // console.log('到底了');
          emits('getListData');
        } else {
          // console.log('隐藏了');
        }
      });
    },
    {
      root: longListRef.value,
      rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
    }
  );
  intersectionObserver.value.observe(bottomRef.value);
}

onMounted(() => {
  monitTouchBottom();
});
onUnmounted(() => {
  intersectionObserver.value?.disconnect();
});
</script>

<style lang="scss" scoped>
.long-list-wrap {
  overflow: scroll;
  box-sizing: border-box;
  padding-bottom: 10px;
  width: 100%;
  height: 100%;

  @extend %customScrollbar;
  .loading {
    width: 100%;
    text-align: center;
  }
}
</style>
