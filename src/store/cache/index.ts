import { defineStore } from 'pinia';

import { AppRootState } from '@/store/app';

export type ResourceCacheRootState = {
  list: AppRootState['allTrack'];
};

export const useResourceCacheStore = defineStore('resource-cache', {
  persist: {
    key: 'resource-cache',
  },
  state: (): ResourceCacheRootState => {
    return {
      list: [],
    };
  },
  actions: {
    setList(res: ResourceCacheRootState['list']) {
      this.list = res;
    },
  },
});
