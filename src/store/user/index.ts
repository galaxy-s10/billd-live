import { mockAjax } from 'billd-utils';
import { defineStore } from 'pinia';

type RootState = {
  detail: any;
};

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      detail: { id: -1 },
    } as RootState;
  },
  actions: {
    async setDetail(payload: number) {
      console.log('setDetail的payload', payload);
      try {
        const data = await mockAjax({ flag: payload === 1 });
        console.log(data);
        this.detail = data;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
