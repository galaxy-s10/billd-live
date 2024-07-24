<template>
  <n-modal
    v-model:show="showModal"
    title="公告"
    preset="dialog"
    positive-text="OK"
  >
    <p>{{ content }}</p>
  </n-modal>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    content: string;
  }>(),
  {
    show: () => {
      return false;
    },
    content: '',
  }
);
const showModal = ref(false);

watch(
  () => props.show,
  () => {
    showModal.value = props.show;
  }
);

onMounted(() => {
  showModal.value = props.show;
});
</script>

<style lang="scss" scoped>
.link {
  color: $theme-color-gold;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}
.hot {
  color: red;
}
</style>
