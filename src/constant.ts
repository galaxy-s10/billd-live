import { MediaTypeEnum } from '@/interface';

export const QQ_CLIENT_ID = '101958191';
export const QQ_OAUTH_URL = 'https://graph.qq.com/oauth2.0';
export const QQ_REDIRECT_URI = 'https://live.hsslive.cn/oauth/qq_login';

export const WECHAT_GZH_APPID = 'wxbd243c01ac5ad1b7'; // 公众号
export const WECHAT_GZH_OAUTH_URL =
  'https://open.weixin.qq.com/connect/oauth2/authorize?';

export const WECHAT_REDIRECT_URI = `http://www.hfgmupw.cn/oauth/wechat_login`;

export const QRCODE_LOGIN_URI = `http://www.hfgmupw.cn/qrcodeLogin`;

export const AUTHOR_GITHUB = 'https://github.com/galaxy-s10';

// wss://srs-pull.hsslive.cn
// ws://www.hfgmupw.cn
export const WEBSOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:4300'
    : 'wss://srs-pull.hsslive.cn';

// https://live-api.hsslive.cn
// http://www.hfgmupw.cn/api/
export const AXIOS_BASEURL =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://live-api.hsslive.cn';

// .hsslive.cn
// .hfgmupw.cn
export const COOKIE_DOMAIN =
  process.env.NODE_ENV === 'development' ? undefined : '.hsslive.cn';

export const COMMON_URL = {
  apifox:
    'https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed/',
  admin: 'https://live-admin.hsslive.cn',
  mobileApk: 'https://resource.hsslive.cn/billd-live/image/app-release.apk',
  bilibiliCollectiondetail:
    'https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070&ctype=0',
  payCoursesArticle: 'https://www.hsslive.cn/article/151',
};

export const SRS_CB_URL_PARAMS = {
  publishKey: 'pushkey',
  publishType: 'pushtype',
  userToken: 'usertoken',
  userId: 'userid',
  randomId: 'randomid',
};

export const QINIU_LIVE = {
  domain: 'resource.hsslive.cn',
  url: 'https://resource.hsslive.cn/',
  bucket: 'hssblog',
  prefix: {
    'billd-live/image/': 'billd-live/image/',
    'billd-live/msg-image/': 'billd-live/msg-image/',
  },
};

export const DEFAULT_AUTH_INFO = {
  ALL_AUTH: {
    id: 1,
    auth_value: 'ALL_AUTH',
  },
  USER_MANAGE: {
    id: 2,
    auth_value: 'USER_MANAGE',
  },
  ROLE_MANAGE: {
    id: 3,
    auth_value: 'ROLE_MANAGE',
  },
  AUTH_MANAGE: {
    id: 4,
    auth_value: 'AUTH_MANAGE',
  },
  COMMONENT_MANAGE: {
    id: 5,
    auth_value: 'COMMONENT_MANAGE',
  },
  LOG_MANAGE: {
    id: 6,
    auth_value: 'LOG_MANAGE',
  },
  LIVE_MANAGE: {
    id: 7,
    auth_value: 'LIVE_MANAGE',
  },
  LIVE_PUSH: {
    id: 8,
    auth_value: 'LIVE_PUSH',
  },
  LIVE_PULL: {
    id: 9,
    auth_value: 'LIVE_PULL',
  },
  LIVE_PULL_SVIP: {
    id: 10,
    auth_value: 'LIVE_PULL_SVIP',
  },
};

// 全局的cookie的key
export const COOKIE_KEY = {
  thirdLoginInfo: 'thirdLoginInfo',
};

export const lsKeyPrefix = 'billd_live___';

export const MODULE_CONFIG_SWITCH = {
  // 后台入口
  admin: true,
  // app下载入口
  appdownload: true,
  // 文档
  doc: true,
  // 生态系统
  ecosystem: true,
  // 关于
  about: true,
  // 赞助
  sponsors: true,
  // 私有化部署
  privatizationDeployment: true,
  // github
  github: true,
  // 轮播
  slider: true,
  // 底部版权提示
  copyrightNotice: true,
  // 侧边栏
  sidebar: true,
  // 侧边栏排行榜
  sidebarRank: true,
  // 侧边栏商店
  sidebarShop: true,
  // 侧边栏订单
  sidebarOrder: true,
  // 支付
  pay: true,
  // 第三方登录
  thirdLogin: true,
  // qq登录
  qqLogin: true,
  // 微信扫码登录
  wechatQrcodeLogin: false,
  // 微信登录
  wechatLogin: false,
  // github登录
  githubLogin: true,
  // 我要开播按钮
  startLive: true,
  // srs开播
  startLiveSRS: true,
  // webrtc开播
  startLiveWebRTC: true,
  // msr开播
  startLiveWebMSR: true,
};

// 全局的localStorage的key
export const lsKey = {
  lastBuildDate: 'lastBuildDate',
  token: 'token',
};

export const mediaTypeEnumMap = {
  [MediaTypeEnum.camera]: '摄像头',
  [MediaTypeEnum.microphone]: '麦克风',
  [MediaTypeEnum.screen]: '窗口',
  [MediaTypeEnum.img]: '图片',
  [MediaTypeEnum.txt]: '文字',
  [MediaTypeEnum.media]: '视频',
  [MediaTypeEnum.time]: '时间',
  [MediaTypeEnum.stopwatch]: '秒表',
};

export const sliderList = [
  {
    img: 'https://resource.hsslive.cn/billd-live/image/a4039f86e5352bcfccaddecc4b72a1df.webp',
    txt: 'SRS',
    link: 'https://ossrs.net',
  },
  {
    img: 'https://resource.hsslive.cn/image/c3c342f6852706e0b70d011e8753d2d6.webp',
    txt: 'FFmpeg',
    link: 'https://ffmpeg.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/0214acde5f5f5e3caf278ce446cc4414.webp',
    txt: 'WebRTC',
    link: 'https://github.com/webrtc',
  },
  {
    img: 'https://resource.hsslive.cn/billd-live/image/1277df4371045310acbc4bf2fc0811b8.webp',
    txt: 'Vue3',
    link: 'https://vuejs.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/dd907463af7fdec395e5f6d088b0308b.webp',
    txt: 'Pinia',
    link: 'https://pinia.vuejs.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/9d54ed9673f2ca4ffc78fc6348f2b736.png',
    txt: 'TypeScript',
    link: 'https://www.typescriptlang.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/a6473eed036e5d35ca2c9f7118c974cd.webp',
    txt: 'Vite4',
    link: 'https://vitejs.dev',
  },
  {
    img: 'https://resource.hsslive.cn/image/627105f0e5674018cb03c8da036ae5d5.webp',
    txt: 'Webpack5',
    link: 'https://webpack.js.org',
  },
  {
    img: 'https://resource.hsslive.cn/billd-live/image/5304af2ea6864369df3ba895d20e3d14.png',
    txt: 'swc',
    link: 'https://swc.rs',
  },
  {
    img: 'https://resource.hsslive.cn/image/dd8ffe33c22723381a3664684eaca237.png',
    txt: 'esbuild',
    link: 'https://esbuild.github.io',
  },
  {
    img: 'https://resource.hsslive.cn/image/f6b9f5cfade1d96634dddb0b89b056be.png',
    txt: 'Pnpm',
    link: 'https://pnpm.io',
  },
  {
    img: 'https://resource.hsslive.cn/image/89fadfed21f1dd6389dfeb227b3d1ca6.webp',
    txt: 'naive-ui',
    link: 'https://www.naiveui.com',
  },
  {
    img: 'https://resource.hsslive.cn/image/5ce36cab3d6b23974625900dc4cf39a3.webp',
    txt: 'Node',
    link: 'https://nodejs.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/0dcabc80c616240edc3111450fbf79aa.webp',
    txt: 'socket.io',
    link: 'https://socket.io',
  },
  {
    img: 'https://resource.hsslive.cn/image/2009474c455813d487803e2acfcbb4af.webp',
    txt: 'mysql',
    link: 'https://www.mysql.com/',
  },
  {
    img: 'https://resource.hsslive.cn/image/e66deaf779edb2a94e91f9b0f2995f6d.webp',
    txt: 'redis',
    link: 'https://redis.io',
  },
  {
    img: 'https://resource.hsslive.cn/image/fd783552a400643c611c62e9200bb429.webp',
    txt: 'Sequelize',
    link: 'https://sequelize.org',
  },
  {
    img: 'https://resource.hsslive.cn/image/dce3470845321ce654d09ce811837749.webp',
    txt: '腾讯云云直播 CSS',
    link: 'https://cloud.tencent.com/product/css',
  },
  {
    img: 'https://resource.hsslive.cn/image/074835fbbaf976992e78bc6a585530e6.webp',
    txt: '阿里云轻量服务器',
    link: 'https://www.aliyun.com',
  },
  {
    img: 'https://resource.hsslive.cn/image/9a934ebf993f5d3b4146f050f7071518.webp',
    txt: '七牛云对象存储',
    link: 'https://www.qiniu.com',
  },
  {
    img: 'https://resource.hsslive.cn/image/e247f6fd39320051d236f3f844b9056f.webp',
    txt: '支付宝当面付',
    link: 'https://opendocs.alipay.com/open/194',
  },
  {
    img: 'https://resource.hsslive.cn/image/d5eb237bd54bc4e729186115e89e5935.webp',
    txt: 'Docker',
    link: 'https://www.docker.com',
  },
  {
    img: 'https://resource.hsslive.cn/image/92a6f3e295634ddd21b6b8034fa3b25f.webp',
    txt: 'Jenkins',
    link: 'https://www.jenkins.io',
  },
  {
    img: 'https://resource.hsslive.cn/image/354823b72eb805264c940f5232d824fe.webp',
    txt: 'PM2',
    link: 'https://github.com/Unitech/pm2',
  },
  {
    img: 'https://resource.hsslive.cn/image/d4417f70fa36edbc62b5aa3840cbf25f.webp',
    txt: 'bilibili',
    link: 'https://www.bilibili.com',
  },
];
