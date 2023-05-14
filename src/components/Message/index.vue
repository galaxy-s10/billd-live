<template>
  <div>
    <NMessageProvider>
      <ContentCpt></ContentCpt>
    </NMessageProvider>
  </div>
</template>

<script lang="ts">
import { NMessageProvider } from 'naive-ui';
import { defineComponent } from 'vue';

import ContentCpt from './content/index.vue';

export default defineComponent({
  components: { NMessageProvider, ContentCpt },
  setup() {},
});
</script>

<style lang="scss" scoped></style>
