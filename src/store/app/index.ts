import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      counter: 1,
      liveStatus: false,
    } as {
      counter: number;
      liveStatus: boolean;
    };
  },
  actions: {
    setCounter(res) {
      this.counter = res;
    },
    setLiveStatus(res: boolean) {
      this.liveStatus = res;
    },
  },
});
