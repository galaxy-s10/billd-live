import { IPaging, IUser } from '@/interface';
import request from '@/utils/request';

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
