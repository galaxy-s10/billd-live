import request from '@/utils/request';

// qq登录
export function fetchWechatLogin(data: {
  code: any;
  platform: string;
  exp: number;
  login_id: string;
}) {
  return request.instance({
    url: `/wechat_user/login`,
    method: 'post',
    data,
  });
}
