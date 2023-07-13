// 这里放项目里面的类型

export enum PayStatusEnum {
  error = 'error',
  WAIT_BUYER_PAY = 'WAIT_BUYER_PAY',
  TRADE_SUCCESS = 'TRADE_SUCCESS',
}

export interface IServerInfo {
  project_name: string;
  project_env: string;
  updated_at: string;
  server: {
    uname: string;
    redisVersion: string;
    mysqlVersion: string;
    nginxVersion: string;
    dockerVersion: string;
    pm2Version: string;
    nodeVersion: string;
    npmVersion: string;
    pnpmVersion: string;
  };
  billd: {
    pkgName: string;
    pkgVersion: string;
    pkgRepository: string;
    commitSubject: string;
    commitBranch: string;
    committerDate: string;
    commitHash: string;
    committerName: string;
    committerEmail: string;
    lastBuildDate: string;
    nodeVersion: string;
  };
}

export enum RankTypeEnum {
  liveRoom = 'liveRoom',
  user = 'user',
  sponsors = 'sponsors',
  wallet = 'wallet',
  blog = 'blog',
}

export interface IWallet {
  id?: number;
  user_id?: number;
  balance?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
export type IList<T> = {
  nowPage?: string;
  pageSize?: string;
  orderBy?: string;
  orderName?: string;
  keyWord?: string;
  rangTimeType?: 'created_at' | 'updated_at' | 'deleted_at';
  rangTimeStart?: string;
  rangTimeEnd?: string;
} & T;

export interface IPaging<T> {
  nowPage: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
  rows: T[];
}

export interface IOrder {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 商品信息 */
  goods?: IGoods;
  billd_live_user_id?: number;
  billd_live_goods_id?: number;
  billd_live_live_room_id?: number;
  /** 判断幂等 */
  billd_live_order_version?: number;
  billd_live_order_subject?: string;
  product_code?: string;
  qr_code?: string;
  /** 买家支付宝账号 */
  buyer_logon_id?: string;
  /** 买家实付金额，单位为元，两位小数。 */
  buyer_pay_amount?: string;
  /** 买家在支付宝的用户id */
  buyer_user_id?: string;
  /** 交易的订单金额，单位为元，两位小数。该参数的值为支付时传入的total_amount */
  total_amount?: string;
  /** 交易中用户支付的可开具发票的金额，单位为元，两位小数。 */
  invoice_amount?: string;
  /** 积分支付的金额，单位为元，两位小数。 */
  point_amount?: string;
  /** 实收金额，单位为元，两位小数。该金额为本笔交易，商户账户能够实际收到的金额 */
  receipt_amount?: string;
  /** 支付宝交易号 */
  trade_no?: string;
  /** 商家订单号 */
  out_trade_no?: string;
  /** 交易状态：WAIT_BUYER_PAY（交易创建，等待买家付款）、TRADE_CLOSED（未付款交易超时关闭，或支付完成后全额退款）、TRADE_SUCCESS（交易支付成功）、TRADE_FINISHED（交易结束，不可退款） */
  trade_status?: string;
  /** 本次交易打款给卖家的时间 */
  send_pay_date?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum GoodsTypeEnum {
  support = 'support',
  sponsors = 'sponsors',
  gift = 'gift',
  recharge = 'recharge',
}

export interface IGoods {
  id?: number;
  type?: GoodsTypeEnum;
  name?: string;
  desc?: string;
  short_desc?: string;
  cover?: string;
  price?: string;
  original_price?: string;
  nums?: number;
  badge?: string;
  badge_bg?: string;
  remark?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ILiveRoom {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 用户信息 */
  users?: IUser[];
  /** 分区信息 */
  area?: IArea;
  /** 直播信息 */
  live?: ILive;
  user_live_room?: IUserLiveRoom & { user: IUser };
  name?: string;
  /** 1:使用cdn;2:不使用cdn */
  cdn?: number;
  /** 权重 */
  weight?: number;
  key?: string;
  type?: LiveRoomTypeEnum;
  cover_img?: string;
  rtmp_url?: string;
  flv_url?: string;
  hls_url?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IUserLiveRoom {
  id?: number;
  user_id?: number;
  live_room_id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum liveTypeEnum {
  webrtcPull = 'webrtcPull',
  srsWebrtcPull = 'srsWebrtcPull',
  srsFlvPull = 'srsFlvPull',
  srsHlsPull = 'srsHlsPull',
  srsPush = 'srsPush',
  webrtcPush = 'webrtcPush',
}

/** 直播间类型 */
export enum LiveRoomTypeEnum {
  system, // 系统直播
  user_wertc, // 主播使用webrtc直播（用户只能看webrtc直播）
  user_srs, // 主播使用srs直播（用户可以看webrtc或flv直播）
  user_obs, // 主播使用obs/ffmpeg直播（用户只能看flv直播）
}

export interface BilldHtmlWebpackPluginLog {
  pkgName: string;
  pkgVersion: string;
  pkgRepository: string;
  commitSubject: string;
  commitBranch: string;
  committerDate: string;
  commitHash: string;
  committerName: string;
  committerEmail: string;
  lastBuildDate: string;
}

export enum PlatformEnum {
  qqLogin = 'qq_login',
}

export interface IAuth {
  id?: number;
  auth_name?: string;
  auth_value?: string;
  type?: number;
  priority?: number | string;
  p_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  c_auths?: number[];
}

export interface IRole {
  id?: number;
  role_name?: string;
  role_value?: string;
  type?: number;
  priority?: number | string;
  p_id?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: null;
  role_auths?: number[];
  c_roles?: number[];
}
export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  status?: number;
  avatar?: string;
  desc?: string;
  token?: string;
  user_roles?: number[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  qq_users?: IQqUser[];
  live_rooms?: ILiveRoom[];
  wallet?: IWallet;
}

export interface IQqUser {
  id?: number;
  client_id?: number;
  openid?: string;
  unionid?: string;
  username?: string;
  figureurl?: string;
  figureurl_1?: string;
  figureurl_2?: string;
  figureurl_qq_1?: string;
  figureurl_qq_2?: string;
  constellation?: string;
  gender?: string;
  city?: string;
  province?: string;
  year?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
}

export interface IArea {
  id?: number;
  name?: string;
  remark?: string;
  /** 权重 */
  weight?: number;
  area_live_rooms?: IAreaLiveRoom[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IAreaLiveRoom {
  id?: number;
  area_id?: number;
  live_room_id?: number;
  /** 分区信息 */
  area?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ILive {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;
  socket_id?: string;
  user_id?: number;
  live_room_id?: number;
  /** 1开启;2关闭 */
  track_video?: number;
  /** 1开启;2关闭 */
  track_audio?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum MediaTypeEnum {
  camera,
  screen,
}

export enum DanmuMsgTypeEnum {
  danmu,
  otherJoin,
  userLeaved,
}

export interface IUpdateJoinInfo {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data: {
    live_room_id: number;
  };
}

export interface ILiveUser {
  id: string;
  rooms?: string[];
  userInfo?: IUser;
}

export interface IDanmu {
  msgType: DanmuMsgTypeEnum;
  msg: string;
  socket_id: string;
  userInfo?: IUser;
}

export interface IMessage {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data: {
    msgType: DanmuMsgTypeEnum;
    msg: string;
    live_room_id: number;
  };
}

export type IOtherJoin = {
  data: {
    liveRoom: IUserLiveRoom;
    join_socket_id: string;
  };
};
export interface IJoin {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data: {
    live_id?: number;
    live_room: ILiveRoom;
    track: { audio: number; video: number };
  };
}

export interface IOffer {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data: {
    sdp: any;
    sender: string;
    receiver: string;
    live_room_id: number;
  };
}

export interface IAnswer {
  sdp: any;
  sender: string;
  receiver: string;
  live_room_id: number;
}
export interface IHeartbeat {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data?: {
    live_id: number;
    live_room_id: number;
  };
}

export interface ICandidate {
  socket_id: string;
  is_anchor: boolean;
  user_info?: IUser;
  data: {
    live_room_id: number;
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    receiver: string;
    sender: string;
  };
}
