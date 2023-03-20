import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      counter: 1,
    };
  },
  actions: {
    setCounter(res) {
      this.counter = res;
    },
  },
});
