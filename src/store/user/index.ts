import { defineStore } from 'pinia';

import { fetchUserInfo } from '@/api/user';
import { IRole, IUser } from '@/interface';
import { clearToken, setToken } from '@/utils/localStorage/user';

type RootState = {
  userInfo?: IUser;
  token?: string;
  roles?: IRole[];
};

export const useUserStore = defineStore('user', {
  state: (): RootState => {
    return {
      userInfo: undefined,
      token: undefined,
      roles: [],
    };
  },
  actions: {
    setUserInfo(res) {
      this.userInfo = res;
    },
    setToken(res) {
      setToken(res);
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    logout() {
      clearToken();
      this.token = undefined;
      this.userInfo = undefined;
      this.roles = [];
    },
    async getUserInfo() {
      try {
        const { code, data }: any = await fetchUserInfo();
        this.setUserInfo(data);
        this.setRoles(data.roles);
        return { code, data };
      } catch (error) {
        return error;
      }
    },
  },
});
