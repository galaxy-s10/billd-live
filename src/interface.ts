/** 这里放项目里面的类型 */

export interface IQiniuData {
  id?: number;
  user_id?: number;
  prefix?: string;
  bucket?: string;
  qiniu_key?: string;
  qiniu_hash?: string;
  qiniu_fsize?: number;
  qiniu_mimeType?: string;
  qiniu_putTime?: number;
  qiniu_type?: number;
  qiniu_status?: number;
  qiniu_md5?: string;
}

export enum LiveLineEnum {
  rtc = 'rtc',
  hls = 'hls',
  flv = 'flv',
}

export enum PayStatusEnum {
  wait = 'billd_status_wait',
  timeout = 'billd_status_timeout',
  /** （交易创建，等待买家付款） */
  WAIT_BUYER_PAY = 'WAIT_BUYER_PAY',
  /** （交易支付成功） */
  TRADE_SUCCESS = 'TRADE_SUCCESS',
  /** （未付款交易超时关闭，或支付完成后全额退款） */
  TRADE_CLOSED = 'TRADE_CLOSED',
  /** （交易结束，不可退款） */
  TRADE_FINISHED = 'TRADE_FINISHED',
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

export enum FormTypeEnum {
  'input' = 'input',
  'password' = 'password',
  'number' = 'number',
  'select' = 'select',
  'radio' = 'radio',
  'checkbox' = 'checkbox',
  'markdown' = 'markdown',
  'switch' = 'switch',
  'upload' = 'upload',
  'treeSelect' = 'treeSelect',
  'datePicker' = 'datePicker',
}

export interface ILiveConfig {
  id?: number;
  key?: string;
  value?: string;
  desc?: string;
  type?: FormTypeEnum;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IOrder {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 商品信息 */
  goods?: IGoods;
  /** 直播间信息 */
  live_room?: IGoods;

  billd_live_user_id?: number;
  billd_live_goods_id?: number;
  billd_live_live_room_id?: number;
  billd_live_order_subject?: string;
  /** 判断幂等 */
  billd_live_order_version?: number;
  client_ip?: string;

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
  trade_status?: PayStatusEnum;
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

/** 拉流是否需要鉴权 */
export enum LiveRoomPullIsShouldAuthEnum {
  /** 需要鉴权 */
  yes,
  /** 不需要鉴权 */
  no,
}
/** 是否使用cdn */
export enum LiveRoomUseCDNEnum {
  /** 使用cdn */
  yes = 1,
  /** 不使用cdn */
  no = 2,
}

/** 直播间状态 */
export enum LiveRoomStatusEnum {
  /** 正常 */
  normal,
  /** 禁用 */
  disable,
}

/** 直播间是否显示 */
export enum LiveRoomIsShowEnum {
  /** 显示 */
  yes,
  /** 不显示 */
  no,
}

export interface ILiveRoom {
  id?: number;
  /** 直播间名称 */
  name?: string;
  /** 直播间简介 */
  desc?: string;
  /** 直播间备注 */
  remark?: string;
  /** 是否使用cdn */
  cdn?: LiveRoomUseCDNEnum;
  /** 拉流是否需要鉴权 */
  pull_is_should_auth?: LiveRoomPullIsShouldAuthEnum;
  /** 权重 */
  weight?: number;
  /** 推流秘钥 */
  key?: string;
  /** 直播间类型 */
  type?: LiveRoomTypeEnum;
  /** 开播预览图 */
  cover_img?: string;
  /** 直播间背景图 */
  bg_img?: string;
  /** 直播间状态 */
  status?: LiveRoomStatusEnum;
  /** 直播间是否显示 */
  is_show?: LiveRoomIsShowEnum;

  /** 用户信息 */
  user?: IUser;
  /** 用户信息 */
  users?: IUser[];
  /** 分区信息 */
  area?: IArea;
  /** 分区信息 */
  areas?: IArea[];
  /** 直播信息 */
  live?: ILive;
  user_live_room?: IUserLiveRoom & { user: IUser };

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

/** 直播间类型 */
export enum LiveRoomTypeEnum {
  /** 系统直播 */
  system,
  /** 主播使用webrtc直播 */
  user_wertc,
  /** 主播使用srs直播 */
  user_srs,
  /** 主播使用obs/ffmpeg直播 */
  user_obs,
  /** 主播使用msr直播 */
  user_msr,
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
  wechatLogin = 'wechat_login',
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

  wallet?: IWallet;
  live_room?: ILiveRoom;
  live_rooms?: ILiveRoom[];

  roles?: IRole[];
  auths?: IAuth[];
  user_roles?: number[];

  qq_users?: IQqUser[];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
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
  /** 备注 */
  remark?: string;
  /** 权重 */
  weight?: number;
  area_live_rooms?: IAreaLiveRoom[];
  live_room_is_show?: LiveRoomIsShowEnum;
  live_room_status?: LiveRoomStatusEnum;
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

export interface ISrsPublishStream {
  /** 客户端在获取信息时，必须检查ServerID是否改变，改变时就是服务器重启，之前所有的数据都应该作废了。 */
  srs_server_id?: string;
  srs_service_id?: string;
  srs_action?: string;
  srs_client_id?: string;
  srs_ip?: string;
  srs_vhost?: string;
  srs_app?: string;
  srs_tcUrl?: string;
  srs_stream?: string;
  srs_param?: string;
  srs_stream_url?: string;
  srs_stream_id?: string;
}

export interface ILive extends ISrsPublishStream {
  id?: number;
  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;

  socket_id?: string;
  user_id?: number;
  live_room_id?: number;
  live_room_is_show?: LiveRoomIsShowEnum;
  live_room_status?: LiveRoomStatusEnum;
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
  microphone,
  txt,
  img,
  media,
  time,
  stopwatch,
  webAudio,
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
    track?: { audio: number; video: number };
    rtmp_url?: string;
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
  msgIsFile: boolean;
}
