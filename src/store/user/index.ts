import { mockAjax } from 'billd-utils';
import { defineStore } from 'pinia';

type UserRootState = {
  detail: any;
};

export const useUserStore = defineStore('user', {
  state: (): UserRootState => {
    return {
      detail: null,
    };
  },
  actions: {
    async setDetail(payload: number) {
      try {
        const data = await mockAjax({ flag: payload === 1 });
        this.detail = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
