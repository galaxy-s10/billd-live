export const prodDomain = 'hsslive.cn';
export const headTitle = prodDomain.split('.')[0];

export const QQ_CLIENT_ID = 101958191;
export const QQ_OAUTH_URL =
  'https://graph.qq.com/oauth2.0/authorize?response_type=code&';

export const GITHUB_CLIENT_ID = '8c2c07b574ae70ecfa9d';
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize?';

export const WECHAT_GZH_APPID = `wxbd243c01ac5ad1b7`; // 公众号
export const WECHAT_GZH_OAUTH_URL = `https://open.weixin.qq.com/connect/oauth2/authorize?`;

export const TENCENTCLOUD_APPID = 1324073273; // 腾讯云APPID
export const TENCENTCLOUD_COS = {
  [`res-${TENCENTCLOUD_APPID}`]: {
    url: `https://res.${prodDomain}`,
    Bucket: `res-${TENCENTCLOUD_APPID}`,
    Region: 'ap-mumbai',
    StorageClass: 'STANDARD',
    prefix: {
      'common/': 'common/',
      'images/': 'images/',
      'msg-images/': 'msg-images/',
    },
  },
};

export const QINIU_KODO = {
  hssblog: {
    domain: `resource.${prodDomain}`,
    url: `http://resource.${prodDomain}/`,
    bucket: 'hssblog',
    prefix: {
      'billd-live/image/': 'billd-live/image/',
      'billd-live/msg-image/': 'billd-live/msg-image/',
      'billd-live/live-preview/': 'billd-live/live-preview/',
    },
  },
  'hss-backup': {
    domain: `backup.${prodDomain}`,
    url: `http://backup.${prodDomain}/`,
    bucket: 'hss-backup',
    prefix: {
      'billd-live/mysql/': 'billd-live/mysql/',
    },
  },
};

export const WEBSOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? `ws://localhost:4300` // `ws://localhost:4300`
    : `wss://srs-pull.${prodDomain}`;

export const AXIOS_BASEURL =
  process.env.NODE_ENV === 'development'
    ? `/api`
    : `https://live-api.${prodDomain}`;

export enum REDIS_DATABASE {
  blog,
  live,
}
