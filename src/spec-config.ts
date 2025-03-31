export const PROD_DOMAIN = 'hsslive.cn';

export const QQ_CLIENT_ID = 101958191;
export const QQ_REDIRECT_URI = `https://live.${PROD_DOMAIN}/oauth/qq_login`;

export const WECHAT_GZH_APPID = ''; // 公众号

export const WECHAT_REDIRECT_URI = `https://live.${PROD_DOMAIN}/oauth/wechat_login`;

export const TENCENTCLOUD_APPID = 1305322458; // 腾讯云APPID
export const TENCENTCLOUD_COS = {
  [`res-${TENCENTCLOUD_APPID}`]: {
    url: `https://tencentcos-res.${PROD_DOMAIN}`,
    Bucket: `res-${TENCENTCLOUD_APPID}`,
    Region: 'ap-guangzhou',
    StorageClass: 'STANDARD',
    prefix: {
      'billd-live/client/common/': 'billd-live/client/common/',
      'billd-live/client/img/': 'billd-live/client/img/',
      'billd-live/client/msg-img/': 'billd-live/client/msg-img/',
    },
  },
};
export const TENCENTCLOUD_CHAT_SDK_APPID = 1400815419; // 腾讯云即时通讯IM SDKAppID

export const QINIU_KODO = {
  hssblog: {
    domain: `resource.${PROD_DOMAIN}`,
    url: `https://resource.${PROD_DOMAIN}`,
    bucket: 'hssblog',
    prefix: {
      'billd-live/image/': 'billd-live/image/',
      'billd-live/msg-image/': 'billd-live/msg-image/',
      'billd-live/live-preview/': 'billd-live/live-preview/',
    },
  },
  'hss-backup': {
    domain: `backup.${PROD_DOMAIN}`,
    url: `http://backup.${PROD_DOMAIN}`,
    bucket: 'hss-backup',
    prefix: {
      'billd-live/mysql/': 'billd-live/mysql/',
    },
  },
};

export const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'development' ? undefined : `.${PROD_DOMAIN}`;

export const WEBSOCKET_PROTOCOL =
  process.env.NODE_ENV === 'development' ? `ws` : `wss`;
export const WEBSOCKET_HOST =
  process.env.NODE_ENV === 'development'
    ? `localhost:4300`
    : `live-api.${PROD_DOMAIN}`;

export const AXIOS_BASEURL =
  process.env.NODE_ENV === 'development'
    ? `/api`
    : `https://live-api.${PROD_DOMAIN}`;

export enum REDIS_DATABASE {
  blog,
  live,
}

export const KONGKONG_SERVER_IP = '8.218.5.78';
