import request from '@/utils/request';

// qq登录
export function fetchQQLogin({ code, exp }) {
  return request.instance({
    url: `/qq_user/login`,
    method: 'post',
    data: { code, exp },
  });
}
