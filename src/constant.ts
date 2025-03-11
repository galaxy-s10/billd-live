import { DanmuMsgTypeEnum, GoodsTypeEnum, MediaTypeEnum } from '@/interface';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';

export const NODE_ENV = process.env.NODE_ENV;

export const AUTHOR_GITHUB = `https://github.com/galaxy-s10`;

export const PROJECT_NAME = 'billd-live';

export const AUTHOR_INFO = {
  github: 'https://github.com/galaxy-s10',
  wechat: 'shuisheng9905',
  qq: '2274751790',
};

export const appBuildInfo =
  // @ts-ignore
  process.env.BilldHtmlWebpackPlugin as BilldHtmlWebpackPluginLog;

export const THEME_COLOR = '#ffd700';

export const DEFAULT_RATIO = 16 / 9;

export const SRS_CB_URL_QUERY = {
  publishKey: 'pushkey',
  publishType: 'pushtype',
  userToken: 'usertoken',
  userId: 'userid',
  randomId: 'randomid',
  roomId: 'roomid',
  isdev: 'isdev',
};

export const URL_QUERY = {
  goodsType: 'goodsType',
  pkKey: 'pkKey',
  roomId: 'roomId',
  liveType: 'liveType',
  isBilibili: 'isBilibili',
};

export const COMMON_URL = {
  apifox: `https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed/`,
  admin: `https://live-admin.hsslive.cn`,
  bilibiliCollectiondetail: `https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070&ctype=0`,
  payCoursesArticle: `https://www.hsslive.cn/article/151`,
  download: {
    live: {
      flutter: {
        android: `https://tencentcos-res.hsslive.cn/billd-live-flutter/app-release.apk`,
        github: 'https://github.com/galaxy-s10/billd-live-flutter',
      },
      reactNative: {
        android: '',
        github: 'https://github.com/galaxy-s10/billd-live-react-native',
      },
      kotlin: {
        android: '',
        github: 'https://github.com/galaxy-s10/billd-live-kotlin',
      },
      electron: {
        github: 'https://github.com/galaxy-s10/billd-live-electron',
        windows: ``,
        macOS: ``,
      },
    },
  },
  release: {
    flutter: 'https://github.com/galaxy-s10/billd-live-flutter',
    kotlin: 'https://github.com/galaxy-s10/billd-live-kotlin',
    reactNative: 'https://github.com/galaxy-s10/billd-live-react-native',
    electron: 'https://github.com/galaxy-s10/billd-live-electron',
  },
};

export const DEFAULT_ROLE_INFO = {
  ALL_ROLE: {
    id: 1,
    role_value: 'ALL_ROLE',
  },
  ADMIN: {
    id: 2,
    role_value: 'ADMIN',
  },
  SUPER_ADMIN: {
    id: 3,
    role_value: 'SUPER_ADMIN',
  },
  LIVE_ADMIN: {
    id: 4,
    role_value: 'LIVE_ADMIN',
  },
  USER: {
    id: 5,
    role_value: 'USER',
  },
  VIP_USER: {
    id: 6,
    role_value: 'VIP_USER',
  },
  SVIP_USER: {
    id: 7,
    role_value: 'SVIP_USER',
  },
  TOURIST_USER: {
    id: 8,
    role_value: 'TOURIST_USER',
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
  MESSAGE_MANAGE: {
    id: 5,
    auth_value: 'MESSAGE_MANAGE',
  },
  MESSAGE_SEND: {
    id: 6,
    auth_value: 'MESSAGE_SEND',
  },
  MESSAGE_DISABLE: {
    id: 7,
    auth_value: 'MESSAGE_DISABLE',
  },
  LOG_MANAGE: {
    id: 8,
    auth_value: 'LOG_MANAGE',
  },
  LIVE_MANAGE: {
    id: 9,
    auth_value: 'LIVE_MANAGE',
  },
  LIVE_PUSH: {
    id: 10,
    auth_value: 'LIVE_PUSH',
  },
  LIVE_PULL: {
    id: 11,
    auth_value: 'LIVE_PULL',
  },
  LIVE_PULL_SVIP: {
    id: 12,
    auth_value: 'LIVE_PULL_SVIP',
  },
  LIVE_PUSH_CDN: {
    id: 13,
    auth_value: 'LIVE_PUSH_CDN',
  },
  LIVE_PUSH_FORWARD_BILIBILI: {
    id: 14,
    auth_value: 'LIVE_PUSH_FORWARD_BILIBILI',
  },
  LIVE_PUSH_FORWARD_HUYA: {
    id: 15,
    auth_value: 'LIVE_PUSH_FORWARD_HUYA',
  },
  LIVE_PUSH_FORWARD_DOUYU: {
    id: 16,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYU',
  },
  LIVE_PUSH_FORWARD_DOUYIN: {
    id: 17,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYIN',
  },
  LIVE_PUSH_FORWARD_KUAISHOU: {
    id: 18,
    auth_value: 'LIVE_PUSH_FORWARD_KUAISHOU',
  },
  LIVE_PUSH_FORWARD_XIAOHONGSHU: {
    id: 19,
    auth_value: 'LIVE_PUSH_FORWARD_XIAOHONGSHU',
  },
};

// 全局的cookie的key
export const COOKIE_KEY = {
  thirdLoginInfo: 'thirdLoginInfo',
};

export const lsKeyPrefix = 'billd_live___';

// 全局的localStorage的key
export const lsKey = {
  lastBuildDate: 'lastBuildDate',
  token: 'token',
};

export const goodsTypeEnumMap = {
  [GoodsTypeEnum.recharge]: '充值',
  [GoodsTypeEnum.gift]: '礼物',
  [GoodsTypeEnum.sponsors]: '赞助',
  [GoodsTypeEnum.support]: '服务',
  [GoodsTypeEnum.qypShop]: '逸鹏的商品',
};

export const allMediaTypeList = {
  [MediaTypeEnum.camera]: {
    type: MediaTypeEnum.camera,
    txt: '摄像头',
    priority: 1,
  },
  [MediaTypeEnum.cameraRemoveGreen]: {
    type: MediaTypeEnum.cameraRemoveGreen,
    txt: '摄像头（移除绿幕）',
    priority: 2,
  },
  [MediaTypeEnum.media]: {
    type: MediaTypeEnum.media,
    txt: '视频',
    priority: 3,
  },
  [MediaTypeEnum.mediaRemoveGreen]: {
    type: MediaTypeEnum.mediaRemoveGreen,
    txt: '视频（移除绿幕）',
    priority: 4,
  },
  [MediaTypeEnum.microphone]: {
    type: MediaTypeEnum.microphone,
    txt: '麦克风',
    priority: 5,
  },
  [MediaTypeEnum.screen]: {
    type: MediaTypeEnum.screen,
    txt: '窗口',
    priority: 6,
  },
  [MediaTypeEnum.txt]: {
    type: MediaTypeEnum.txt,
    txt: '文字',
    priority: 7,
  },
  [MediaTypeEnum.img]: {
    type: MediaTypeEnum.img,
    txt: '图片',
    priority: 8,
  },

  [MediaTypeEnum.time]: {
    type: MediaTypeEnum.time,
    txt: '时间',
    priority: 9,
  },
  [MediaTypeEnum.stopwatch]: {
    type: MediaTypeEnum.stopwatch,
    txt: '秒表',
    priority: 10,
  },
};

export const liveRoomTypeEnumMap = {
  [LiveRoomTypeEnum.msr]: 'msr推流',
  [LiveRoomTypeEnum.obs]: 'obs推流',
  [LiveRoomTypeEnum.pk]: '打pk',
  [LiveRoomTypeEnum.srs]: 'srs推流',
  [LiveRoomTypeEnum.system]: '系统推流',
  [LiveRoomTypeEnum.tencentcloud_css]: '腾讯云css推流',
  [LiveRoomTypeEnum.tencentcloud_css_pk]: '腾讯云css打pk',
  [LiveRoomTypeEnum.wertc_live]: 'webrtc直播',
  [LiveRoomTypeEnum.wertc_meeting_one]: 'webrtc会议一',
  [LiveRoomTypeEnum.wertc_meeting_two]: 'webrtc会议二',
  [LiveRoomTypeEnum.forward_all]: '转推所有',
  [LiveRoomTypeEnum.forward_bilibili]: '转推b站',
  [LiveRoomTypeEnum.forward_douyin]: '转推抖音',
  [LiveRoomTypeEnum.forward_douyu]: '转推斗鱼',
  [LiveRoomTypeEnum.forward_huya]: '转推虎牙',
  [LiveRoomTypeEnum.forward_kuaishou]: '转推快手',
  [LiveRoomTypeEnum.forward_xiaohongshu]: '转推小红书',
};

export const msgTypeMap = {
  [DanmuMsgTypeEnum.danmu]: '弹幕',
  [DanmuMsgTypeEnum.otherJoin]: '其他人加入房间',
  [DanmuMsgTypeEnum.redbag]: '红包',
  [DanmuMsgTypeEnum.reward]: '打赏',
  [DanmuMsgTypeEnum.system]: '系统消息',
  [DanmuMsgTypeEnum.userLeaved]: '用户离开房间',
};

export const sliderList = [
  {
    img: '',
    txt: '',
    link: '',
  },
];
