import { defineStore } from 'pinia';

type AppRootState = {
  liveStatus: boolean;
  muted: boolean;
  mobileNav: { id: number; name: string };
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      liveStatus: false,
      muted: true,
      mobileNav: { id: 1, name: '频道' },
    };
  },
  actions: {
    setLiveStatus(res: AppRootState['liveStatus']) {
      this.liveStatus = res;
    },
    setMuted(res: AppRootState['muted']) {
      this.muted = res;
    },
    setMobileNav(res: AppRootState['mobileNav']) {
      this.mobileNav = res;
    },
  },
});
