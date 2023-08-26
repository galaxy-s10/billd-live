<template>
  <div>
    <SrsCpt v-if="route.query.liveType === LiveTypeEnum.srsPush"></SrsCpt>
    <RtcCpt
      v-else-if="route.query.liveType === LiveTypeEnum.webrtcPush"
    ></RtcCpt>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { LiveTypeEnum } from '@/interface';

import RtcCpt from './rtc/index.vue';
import SrsCpt from './srs/index.vue';

const route = useRoute();
</script>

<style lang="scss" scoped></style>
