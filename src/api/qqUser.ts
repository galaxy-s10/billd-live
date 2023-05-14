import request from '@/utils/request';

// qq登录
export function fetchQQLogin(code: any) {
  return request.instance({
    url: `/api/qq_user/login`,
    method: 'post',
    data: { code },
  });
}
