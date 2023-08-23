<template>
  <div>
    <SrsCpt v-if="route.query.liveType === liveTypeEnum.srsPush"></SrsCpt>
    <RtcCpt
      v-else-if="route.query.liveType === liveTypeEnum.webrtcPush"
    ></RtcCpt>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { liveTypeEnum } from '@/interface';

import RtcCpt from './rtc/index.vue';
import SrsCpt from './srs/index.vue';

const route = useRoute();
</script>

<style lang="scss" scoped></style>
