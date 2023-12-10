import request from '@/utils/request';

// qq登录
export function fetchWechatLogin(code: any) {
  return request.instance({
    url: `/wechat_user/login`,
    method: 'post',
    data: { code },
  });
}
