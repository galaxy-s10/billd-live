import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';

export interface IBilibiliLiveUserRecommend {
  roomid: number;
  uid: number;
  title: string;
  uname: string;
  online: number;
  user_cover: string;
  user_cover_flag: number;
  system_cover: string;
  cover: string;
  show_cover: string;
  link: string;
  face: string;
  parent_id: number;
  parent_name: string;
  area_id: number;
  area_name: string;
  area_v2_parent_id: number;
  area_v2_parent_name: string;
  area_v2_id: number;
  area_v2_name: string;
  session_id: string;
  group_id: number;
  show_callback: string;
  click_callback: string;
  web_pendent: string;
  pk_id: number;
  pendant_info: {
    '1': {
      pendent_id: number;
      content: string;
      color: string;
      pic: string;
      position: number;
      type: string;
      name: string;
    };
  };
  verify: { role: number; desc: string; type: number };
  head_box: { name: string; value: string; desc: string };
  head_box_type: number;
  is_auto_play: number;
  flag: number;
  watched_show: {
    switch: boolean;
    num: number;
    text_small: string;
    text_large: string;
    icon: string;
    icon_location: number;
    icon_web: string;
  };
  is_nft: number;
  nft_dmark: string;
  play_together_goods?: any;
  watermark: string;
}
export interface IBilibiliLiveRoomInfo {
  uid: number;
  room_id: number;
  short_id: number;
  attention: number;
  online: number;
  is_portrait: boolean;
  description: string;
  live_status: number;
  area_id: number;
  parent_area_id: number;
  parent_area_name: string;
  old_area_id: number;
  background: string;
  title: string;
  user_cover: string;
  keyframe: string;
  is_strict_room: boolean;
  live_time: string;
  tags: string;
  is_anchor: number;
  room_silent_type: string;
  room_silent_level: number;
  room_silent_second: number;
  area_name: string;
  pendants: string;
  area_pendants: string;
  hot_words: string[];
  hot_words_status: number;
  verify: string;
  new_pendants: {
    frame: {
      name: string;
      value: string;
      position: number;
      desc: string;
      area: number;
      area_old: number;
      bg_color: string;
      bg_pic: string;
      use_old_area: boolean;
    };
    badge?: any;
    mobile_frame: {
      name: string;
      value: string;
      position: number;
      desc: string;
      area: number;
      area_old: number;
      bg_color: string;
      bg_pic: string;
      use_old_area: boolean;
    };
    mobile_badge?: any;
  };
  up_session: string;
  pk_status: number;
  pk_id: number;
  battle_id: number;
  allow_change_area_time: number;
  allow_upload_cover_time: number;
  studio_info: { status: number; master_list: any[] };
}

export interface IFlvStatistics {
  url: string;
  hasRedirect: boolean;
  speed: number;
  loaderType: string;
  currentSegmentIndex: number;
  totalSegmentCount: number;
  playerType: string;
  decodedFrames: number;
  droppedFrames: number;
}

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

export enum WsMessageIsFileEnum {
  yes,
  no,
}

export enum WsMessageContentTypeEnum {
  txt,
  img,
  video,
}

export enum WsMessageIsShowEnum {
  yes,
  no,
}

export enum WsMessageIsVerifyEnum {
  yes,
  no,
}

export enum WsMessageIsBilibiliEnum {
  yes,
  no,
}

export interface IWsMessage {
  id?: number;
  username?: string;
  origin_username?: string;
  content_type?: WsMessageContentTypeEnum;
  content?: string;
  origin_content?: string;
  redbag_send_id?: number;
  live_room_id?: number;
  user_id?: number;
  ip?: string;
  msg_type?: DanmuMsgTypeEnum;
  user_agent?: string;
  send_msg_time?: number;
  is_show?: WsMessageIsShowEnum;
  is_verify?: WsMessageIsVerifyEnum;
  is_bilibili?: WsMessageIsBilibiliEnum;
  remark?: string;

  user?: IUser;
  redbag_send?: IRedbagSend;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IRedbagSend {
  id?: number;

  user_id?: number;
  live_room_id?: number;

  total_amount?: string;
  remaining_amount?: string;
  total_nums?: number;
  remaining_nums?: number;
  remark?: string;

  /** 用户信息 */
  user?: IUser;
  /** 直播间信息 */
  live_room?: IGoods;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum RedbagIsGrantEnum {
  yes,
  no,
}

export interface IRedbagRecv {
  id?: number;

  user_id?: number;
  redbag_send_id?: number;
  amount?: string;
  remark?: string;

  /** 抢到红包了，是否已发放 */
  is_grant?: RedbagIsGrantEnum;

  /** 用户信息 */
  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum GiftRecordIsRecvEnum {
  yew,
  no,
}

export enum GiftRecordStatusEnum {
  ok,
  balanceError,
}

export interface IGiftRecord {
  id?: number;
  is_recv?: GiftRecordIsRecvEnum;
  goods_id?: number;
  goods_nums?: number;
  goods_snapshot?: string;
  order_id?: number;
  live_room_id?: number;
  send_user_id?: number;
  recv_user_id?: number;
  status?: GiftRecordStatusEnum;
  remark?: string;

  goods?: IGoods;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum LoginRecordEnum {
  registerUsername,
  registerId,
  registerQq,
  loginUsername,
  loginId,
  loginQq,
}

export interface ILoginRecord {
  id?: number;
  user_id?: number;
  user_agent?: string;
  type?: LoginRecordEnum;
  ip?: string;
  remark?: string;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum GlobalMsgTypeEnum {
  user = 'user',
  system = 'system',
  activity = 'activity',
  notification = 'notification',
}

export interface IGlobalMsg {
  id?: number;
  user_id?: number;
  client_ip?: string;
  type?: GlobalMsgTypeEnum;
  show?: SwitchEnum;
  priority?: number;
  title?: string;
  content?: string;
  remark?: string;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ISigninStatistics {
  id?: number;
  user_id?: number;
  live_room_id?: number;
  /** 当前连续签到次数 */
  nums?: number;
  /** 历史最高连续签到次数 */
  max_nums?: number;
  /** 累计签到次数 */
  sum_nums?: number;
  /** 上次签到日期 */
  recently_signin_time?: string;

  /** 用户信息 */
  username?: string;
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ISigninRecord {
  id?: number;
  user_id?: number;
  live_room_id?: number;

  /** 用户信息 */
  username?: string;
  user?: IUser;
  /** 直播间信息 */
  live_room?: ILiveRoom;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum LiveLineEnum {
  'rtmp-rtc' = 'rtmp-rtc',
  rtc = 'rtc',
  hls = 'hls',
  flv = 'flv',
}

export enum LiveRenderEnum {
  video = 'video',
  canvas = 'canvas',
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
  signin = 'signin',
}

export interface IWallet {
  id?: number;
  user_id?: number;
  balance?: number;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type IListBase = {
  nowPage?: number | string;
  pageSize?: number | string;
  orderBy?: string;
  orderName?: string;
  keyWord?: string;
  childNowPage?: number | string;
  childPageSize?: number | string;
  childOrderBy?: string;
  childOrderName?: string;
  childKeyWord?: string;
  rangTimeType?: 'created_at' | 'updated_at' | 'deleted_at';
  rangTimeStart?: number | string;
  rangTimeEnd?: number | string;
};

export type IList<T> = IListBase & T;

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

export enum WalletRecordEnum {
  reward,
  recharge,
  signin,
}

export enum WalletRecordAmountStatusEnum {
  add,
  del,
}

export interface IWalletRecord {
  id?: number;
  user_id?: number;
  order_id?: number;
  type?: WalletRecordEnum;
  name?: string;
  amount?: number;
  amount_status?: WalletRecordAmountStatusEnum;
  remark?: string;

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
  qypShop = 'qypShop',
}

export interface IGoods {
  id?: number;
  type?: GoodsTypeEnum;
  name?: string;
  desc?: string;
  short_desc?: string;
  cover?: string;
  price?: number;
  original_price?: number;
  nums?: number;
  pay_nums?: number;
  inventory?: number;
  badge?: string;
  badge_bg?: string;
  remark?: string;

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

export interface IArea {
  id?: number;
  p_id?: number;
  name?: string;
  status?: SwitchEnum;
  hot_status?: SwitchEnum;
  /** 备注 */
  remark?: string;
  /** 权重 */
  priority?: number;

  children?: IArea[];

  live_rooms?: ILiveRoom[];
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

export type ILive = {
  id?: number;
  /** 直播平台 */
  platform?: LivePlatformEnum;
  /** 直播流名称 */
  stream_name?: string;
  /** 直播流id */
  stream_id?: string;
  /** 用户id */
  user_id?: number;
  /** 直播间id */
  live_room_id?: number;
  /** 备注 */
  remark?: string;

  /** 直播间信息 */
  live_room?: ILiveRoom;
  /** 用户信息 */
  user?: IUser;
  live_record?: ILiveRecord;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

/** 直播平台 */
export enum LivePlatformEnum {
  rtc,
  srs,
  tencentcloud_css,
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
  pk,
  metting,
  mediaRemoveGreen,
  cameraRemoveGreen,
}

export enum DanmuMsgTypeEnum {
  danmu,
  otherJoin,
  userLeaved,
  system,
  redbag,
  reward,
}

export interface ILiveRoomLiveUser {
  live_room_id: number;
  live_room_name: string;
  user_id: number;
  user_username: string;
  user_avatar: string;
}

export interface ICredential {
  expiredTime: number;
  expiration: string;
  credentials: {
    sessionToken: string;
    tmpSecretId: string;
    tmpSecretKey: string;
  };
  requestId: string;
  startTime: number;
}

export enum SwitchEnum {
  yes,
  no,
}

export interface IStreamKey {
  rtmp_url: string;
  obs_server: string;
  obs_stream_key: string;
  webrtc_url: string;
  srt_url: string;
}

export interface IPushRes {
  srsPushRes: IStreamKey;
  cdnPushRes: IStreamKey;
}

export interface ILiveRecord {
  id?: number;
  /** 直播id */
  live_id?: number;
  /** 用户id */
  user_id?: number;
  /** 直播间id */
  live_room_id?: number;
  live_room_type?: LiveRoomTypeEnum;
  area_id?: number;
  /** 直播时长（单位：秒） */
  duration?: number;
  /** 弹幕数 */
  danmu?: number;
  /** 观看数 */
  view?: number;
  /** 直播开始时间 */
  start_time?: string | number;
  /** 直播结束时间 */
  end_time?: string;
  /** 备注 */
  remark?: string;

  /** 直播间信息 */
  live_room?: ILiveRoom;
  /** 用户信息 */
  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum BlacklistTypeEnum {
  /** 频繁请求 */
  frequent,
  /** 管理员禁用 */
  admin_disable,
  /** 禁言 */
  disable_msg,
}

export interface IBlacklist {
  id?: number;
  ip?: string;
  user_id?: number;
  type?: BlacklistTypeEnum;
  start_date?: number;
  end_date?: number;
  msg?: string;
  remark?: string;

  user?: IUser;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
