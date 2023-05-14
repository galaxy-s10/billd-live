import { defineStore } from 'pinia';

type AppRootState = {
  liveStatus: boolean;
  muted: boolean;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      liveStatus: false,
      muted: true,
    };
  },
  actions: {
    setLiveStatus(res: AppRootState['liveStatus']) {
      this.liveStatus = res;
    },
    setMuted(res: AppRootState['muted']) {
      this.muted = res;
    },
  },
});
