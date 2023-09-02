<template>
  <div>
    <SrsCpt v-if="liveType === LiveRoomTypeEnum.user_srs"></SrsCpt>
    <RtcCpt v-else-if="liveType === LiveRoomTypeEnum.user_wertc"></RtcCpt>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { LiveRoomTypeEnum } from '@/interface';

import RtcCpt from './rtc/index.vue';
import SrsCpt from './srs/index.vue';

const route = useRoute();
const liveType = Number(route.query.liveType);
</script>

<style lang="scss" scoped></style>
