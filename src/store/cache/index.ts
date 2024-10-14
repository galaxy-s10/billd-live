import { defineStore } from 'pinia';

import { lsKeyPrefix } from '@/constant';
import { AppRootState } from '@/store/app';

export type PiniaCacheRootState = {
  locale: string;
  muted: boolean;
  volume: number;
  'resource-list': AppRootState['allTrack'];
};

export const useCacheStore = defineStore(`${lsKeyPrefix}pinia-cache`, {
  persist: {
    key: `${lsKeyPrefix}pinia-cache`,
  },
  state: (): PiniaCacheRootState => {
    return {
      locale: 'zh',
      muted: true,
      volume: 80,
      'resource-list': [],
    };
  },
  actions: {
    setResourceList(res: PiniaCacheRootState['resource-list']) {
      this['resource-list'] = res;
    },
  },
});
