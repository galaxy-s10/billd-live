import request from '@/utils/request';

export function fetchEmailUserList(params) {
  return request.get('/email_user/list', {
    params,
  });
}

// 发送邮箱登录验证码登录
export function fetchSendLoginCode(email) {
  return request.post('/email_user/send_login_code', {
    email,
  });
}

// 邮箱验证码登录
export function fetchEmailCodeLogin({ email, code }) {
  return request.post('/email_user/login', {
    email,
    code,
  });
}

// 发送邮箱注册验证码登录
export function fetchSendRegisterCode(email) {
  return request.post('/email_user/send_register_code', {
    email,
  });
}

/** 注册 */
export function fetchRegister({ email, code }) {
  return request.post('/email_user/register', {
    email,
    code,
  });
}

// 绑定邮箱
export function fetchBindEmail({ email, code }) {
  return request.post('/email_user/bind_email', {
    email,
    code,
  });
}

// 发送绑定邮箱验证码
export function fetchSendBindEmailCode(email) {
  return request.post('/email_user/send_bind_code', {
    email,
  });
}

// 取消绑定邮箱
export function fetchCancelBindEmail(code) {
  return request.post('/email_user/cancel_bind_email', {
    code,
  });
}

// 发送取消绑定邮箱验证码
export function fetchCancelSendBindEmailCode(email) {
  return request.post('/email_user/send_cancel_bind_code', {
    email,
  });
}
