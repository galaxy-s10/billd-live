import { defineStore } from 'pinia';

type AppRootState = {
  liveStatus: boolean;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      liveStatus: false,
    };
  },
  actions: {
    setLiveStatus(res: AppRootState['liveStatus']) {
      this.liveStatus = res;
    },
  },
});
