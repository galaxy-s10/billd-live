import cookies from 'js-cookie';

import { COOKIE_KEY } from '@/constant';

export const getLoginInfo = () => {
  return cookies.get(COOKIE_KEY.loginInfo);
};

export const setLoginInfo = (val) => {
  cookies.set(COOKIE_KEY.loginInfo, val, {
    domain: process.env.NODE_ENV === 'development' ? undefined : '.hsslive.cn',
  });
};

export const clearLoginInfo = () => {
  cookies.remove(COOKIE_KEY.loginInfo);
};
