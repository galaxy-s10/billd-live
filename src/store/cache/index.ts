import { defineStore } from 'pinia';

import { AppRootState } from '@/store/app';

export type PiniaCacheRootState = {
  muted: boolean;
  volume: number;
  'resource-list': AppRootState['allTrack'];
};

export const usePiniaCacheStore = defineStore('pinia-cache', {
  persist: {
    key: 'pinia-cache',
  },
  state: (): PiniaCacheRootState => {
    return {
      muted: true,
      volume: 70,
      'resource-list': [],
    };
  },
  actions: {
    setResourceList(res: PiniaCacheRootState['resource-list']) {
      this['resource-list'] = res;
    },
    setMuted(res: PiniaCacheRootState['muted']) {
      this.muted = res;
    },
    setVolume(res: PiniaCacheRootState['volume']) {
      this.volume = res;
    },
  },
});
