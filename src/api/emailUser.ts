import request from '@/utils/request';

export function fetchEmailUserList(params) {
  return request.instance({
    url: '/email_user/list',
    method: 'get',
    params,
  });
}

// 发送邮箱登录验证码登录
export function fetchSendLoginCode(email) {
  return request.instance({
    url: '/email_user/send_login_code',
    method: 'post',
    data: { email },
  });
}

// 邮箱验证码登录
export function fetchEmailCodeLogin({ email, code }) {
  return request.instance({
    url: '/email_user/login',
    method: 'post',
    data: { email, code },
  });
}

// 发送邮箱注册验证码登录
export function fetchSendRegisterCode(email) {
  return request.instance({
    url: '/email_user/send_register_code',
    method: 'post',
    data: { email },
  });
}

/** 注册 */
export function fetchRegister({ email, code }) {
  return request.instance({
    url: '/email_user/register',
    method: 'post',
    data: { email, code },
  });
}

// 绑定邮箱
export function fetchBindEmail({ email, code }) {
  return request.instance({
    url: '/email_user/bind_email',
    method: 'post',
    data: { email, code },
  });
}

// 发送绑定邮箱验证码
export function fetchSendBindEmailCode(email) {
  return request.instance({
    url: '/email_user/send_bind_code',
    method: 'post',
    data: { email },
  });
}

// 取消绑定邮箱
export function fetchCancelBindEmail(code) {
  return request.instance({
    url: '/email_user/cancel_bind_email',
    method: 'post',
    data: { code },
  });
}

// 发送取消绑定邮箱验证码
export function fetchCancelSendBindEmailCode(email) {
  return request.instance({
    url: '/email_user/send_cancel_bind_code',
    method: 'post',
    data: { email },
  });
}
