// 这里放项目里面的类型

export enum PayStatusEnum {
  error = 'error',
  WAIT_BUYER_PAY = 'WAIT_BUYER_PAY',
  TRADE_SUCCESS = 'TRADE_SUCCESS',
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
  billd_live_user_id?: number;
  user: IUser;
  out_trade_no?: string;
  total_amount?: string;
  subject?: string;
  product_code?: string;
  qr_code?: string;
  buyer_logon_id?: string;
  buyer_pay_amount?: string;
  buyer_user_id?: string;
  invoice_amount?: string;
  point_amount?: string;
  receipt_amount?: string;
  send_pay_date?: string;
  trade_no?: string;
  trade_status?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum liveTypeEnum {
  webrtcPull = 'webrtcPull',
  srsWebrtcPull = 'srsWebrtcPull',
  srsFlvPull = 'srsFlvPull',
  srsPush = 'srsPush',
  webrtcPush = 'webrtcPush',
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
  status?: number;
  avatar?: string;
  desc?: string;
  token?: string;
  user_roles?: number[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  qq_users?: IQqUser[];
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

export interface ILive {
  id?: number;
  system?: number;
  socketId?: string;
  roomId?: string;
  roomName?: string;
  track_video?: boolean;
  track_audio?: boolean;
  coverImg?: string;
  streamurl?: string;
  flvurl?: string;
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

export interface ILiveUser {
  socketId: string;
  userInfo?: IUser;
}

export interface IDanmu {
  msgType: DanmuMsgTypeEnum;
  msg: string;
  socketId: string;
  userInfo?: IUser;
}

export interface IAdminIn {
  roomId: string;
  socketId: string;
  isAdmin: boolean;
  data: any;
}

export interface IOffer {
  socketId: string;
  roomId: string;
  data: {
    sdp: any;
    target: string;
    sender: string;
    receiver: string;
  };
  isAdmin: boolean;
}

export interface ICandidate {
  socketId: string;
  roomId: string;
  data: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    receiver: string;
    sender: string;
  };
}

export interface IJoin {
  roomId: string;
  socketId: string;
  data: {
    roomName: string;
    coverImg: string;
    userInfo?: IUser;
    srs?: { streamurl: string; flvurl: string };
    track: { audio: boolean; video: boolean };
    liveId?: number;
  };
  isAdmin?: boolean;
}
