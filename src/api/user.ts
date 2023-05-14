import request from '@/utils/request';

export function fetchUserInfo() {
  return request.instance({
    url: '/api/user/get_user_info',
    method: 'get',
  });
}
