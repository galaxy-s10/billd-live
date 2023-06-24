import { defineStore } from 'pinia';

import { mobileRouterName } from '@/router';

export type AppRootState = {
  liveStatus: boolean;
  muted: boolean;
  navList: { routeName: string; name: string }[];
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      liveStatus: false,
      muted: true,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5Profile, name: '我的' },
      ],
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
