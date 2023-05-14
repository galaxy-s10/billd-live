import { defineStore } from 'pinia';

import { fetchUserInfo } from '@/api/user';
import { IRole } from '@/interface';
import cache from '@/utils/cache';

type RootState = {
  userInfo?: {
    id: number;
    username: string;
    status: number;
    avatar: string;
    title: string;
    created_at: string;
    updated_at: string;
    deleted_at: any;
    send_comments_total: number;
    receive_comments_total: number;
    send_stars_total: number;
    receive_stars_total: number;
    articles_total: number;
    qq_users: any[];
    github_users: any[];
    email_users: any[];
    roles: IRole[];
  };
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
      cache.setStorageExp('token', res, 24);
      this.token = res;
    },
    setRoles(res) {
      this.roles = res;
    },
    logout() {
      cache.clearStorage('token');
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
