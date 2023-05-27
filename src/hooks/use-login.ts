import { hrefToTarget, isMobile } from 'billd-utils';
import { createApp } from 'vue';

import { fetchQQLogin } from '@/api/qqUser';
import { QQ_CLIENT_ID, QQ_OAUTH_URL, QQ_REDIRECT_URI } from '@/constant';
import LoginModalCpt from '@/hooks/loginModal/index.vue';
import { PlatformEnum } from '@/interface';
import { useUserStore } from '@/store/user';
import { clearLoginInfo, setLoginInfo } from '@/utils/cookie';

const app = createApp(LoginModalCpt);
const container = document.createElement('div');
// @ts-ignore
const instance: ComponentPublicInstance<InstanceType<typeof LoginModalCpt>> =
  app.mount(container);

document.body.appendChild(container);

const POSTMESSAGE_TYPE = [PlatformEnum.qqLogin];

export async function handleLogin(e) {
  const { type, data } = e.data;
  if (!POSTMESSAGE_TYPE.includes(type)) return;
  console.log('收到消息', type, data);
  const userStore = useUserStore();

  try {
    switch (type) {
      case PlatformEnum.qqLogin: {
        const res = await fetchQQLogin(data);
        if (res.code === 200) {
          window.$message.success('登录成功！');
        }
        userStore.setToken(res.data);
        userStore.getUserInfo();
        break;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    clearLoginInfo();
  }
}

export function loginTip() {
  const userStore = useUserStore();
  if (!userStore.userInfo) {
    window.$message.warning('请先登录~');
    instance.show = true;
    return false;
  }
  return true;
}

export function loginMessage() {
  window.addEventListener('message', handleLogin);
}

export function useQQLogin() {
  const url = (state: string) =>
    `${QQ_OAUTH_URL}/authorize?response_type=code&client_id=${QQ_CLIENT_ID}&redirect_uri=${QQ_REDIRECT_URI}&scope=get_user_info,get_vip_info,get_vip_rich_info&state=${state}`;
  let loginInfo = JSON.stringify({
    isMobile: false,
    createTime: +new Date(),
    env: 'qq',
    dev: process.env.NODE_ENV === 'development',
  });
  if (isMobile()) {
    loginInfo = JSON.stringify({ ...JSON.parse(loginInfo), isMobile: true });
    setLoginInfo(loginInfo);
    hrefToTarget(url(window.btoa(loginInfo)));
  } else {
    setLoginInfo(loginInfo);
    window.open(
      url(window.btoa(loginInfo)),
      'qq_login_window',
      'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
    );
  }
}
