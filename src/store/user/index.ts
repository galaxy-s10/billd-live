import { defineStore } from 'pinia';

import { fetchLogin, fetchUserInfo } from '@/api/user';
import { IRole, IUser } from '@/interface';
import cache from '@/utils/cache';

type UserRootState = {
  userInfo: IUser | null;
  token: string | null;
  roles: IRole[] | null;
};

export const useUserStore = defineStore('user', {
  state: (): UserRootState => {
    return {
      token: null,
      roles: null,
      userInfo: null,
    };
  },
  actions: {
    setUserInfo(res) {
      this.userInfo = res;
    },
    setToken(res, exp: number) {
      cache.setStorageExp('token', res, exp);
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    logout() {
      cache.clearStorage('token');
      this.token = null;
      this.userInfo = null;
      this.roles = null;
    },
    async pwdLogin({ id, password }) {
      try {
        const { data: token } = await fetchLogin({
          id,
          password,
        });
        this.setToken(token, 24);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
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
