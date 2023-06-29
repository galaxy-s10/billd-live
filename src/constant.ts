export const QQ_CLIENT_ID = '101958191';
export const QQ_OAUTH_URL = 'https://graph.qq.com/oauth2.0';
export const QQ_REDIRECT_URI = 'https://live.hsslive.cn/oauth/qq_login';

export const AUTHOR_GITHUB = 'https://github.com/galaxy-s10';
export const LIVE_CLIENT_URL = 'https://live.hsslive.cn';

export const SRS_STREAM_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:1985'
    : 'https://srs-pull.hsslive.cn/srs';

export const WEBSOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:4300'
    : 'wss://srs-pull.hsslive.cn';

export const APIFOX_URL =
  'https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed/';

// 全局的cookie的key
export const COOKIE_KEY = {
  loginInfo: 'loginInfo',
};

// 全局的localStorage的key
export const LOCALSTORAGE_KEY = {
  verion: '0.0.1',
};
