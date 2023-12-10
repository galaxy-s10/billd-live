import { IPaging, IUser } from '@/interface';
import request from '@/utils/request';

export function fetchQrcodeLogin({ platform, exp }) {
  return request.post<{
    login_id: string;
    exp: any;
    platform: any;
    isLogin: boolean;
    token: string;
  }>('/user/qrcode_login', {
    platform,
    exp,
  });
}

// eslint-disable-next-line
export function fetchQrcodeLoginStatus({ platform, login_id }) {
  return request.get<{
    login_id: string;
    exp: any;
    platform: any;
    isLogin: boolean;
    token: string;
  }>('/user/qrcode_login', {
    // eslint-disable-next-line
    params: { platform, login_id },
  });
}

export function fetchLogin({ id, password }) {
  return request.instance({
    url: '/user/login',
    method: 'post',
    data: { id, password },
  });
}

export function fetchUserInfo() {
  return request.instance({
    url: '/user/get_user_info',
    method: 'get',
  });
}
export function fetchFindUser(userId: number) {
  return request.instance({
    url: `/user/find/${userId}`,
    method: 'get',
  });
}

export function fetchUserList(params: { orderName: string; orderBy: string }) {
  return request.get<IPaging<IUser>>('/user/list', { params });
}

export function fetchBlogUserList(params: {
  orderName: string;
  orderBy: string;
}) {
  return request.get<IPaging<IUser>>(
    'https://api.hsslive.cn/prodapi/user/list',
    { params }
  );
}
