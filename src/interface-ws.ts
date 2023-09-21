import {
  DanmuMsgTypeEnum,
  ILiveRoom,
  IUser,
  LiveRoomTypeEnum,
} from './interface';

// websocket连接状态
export enum WsConnectStatusEnum {
  /** 已连接 */
  connection = 'connection',
  /** 连接中 */
  connecting = 'connecting',
  /** 已连接 */
  connected = 'connected',
  /** 断开连接中 */
  disconnecting = 'disconnecting',
  /** 已断开连接 */
  disconnect = 'disconnect',
  /** 重新连接 */
  reconnect = 'reconnect',
  /** 客户端的已连接 */
  connect = 'connect',
}

// websocket消息类型
export enum WsMsgTypeEnum {
  /** 用户进入聊天 */
  join = 'join',
  /** 用户进入聊天完成 */
  joined = 'joined',
  /** 用户进入聊天 */
  otherJoin = 'otherJoin',
  /** 用户退出聊天 */
  leave = 'leave',
  /** 用户退出聊天完成 */
  leaved = 'leaved',
  /** 当前所有在线用户 */
  liveUser = 'liveUser',
  /** 用户发送消息 */
  message = 'message',
  /** 房间正在直播 */
  roomLiving = 'roomLiving',
  /** 房间不在直播 */
  roomNoLive = 'roomNoLive',
  getLiveUser = 'getLiveUser',
  updateJoinInfo = 'updateJoinInfo',
  heartbeat = 'heartbeat',
  startLive = 'startLive',
  endLive = 'endLive',

  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',

  msrBlob = 'msrBlob',
}

export interface IWsFormat<T> {
  /** 用户socket_id */
  socket_id: string;
  /** 是否是主播 */
  is_anchor: boolean;
  /** 用户信息 */
  user_info?: IUser;
  data: T;
}

export type WsUpdateJoinInfoType = IWsFormat<{
  live_room_id: number;
  track?: { audio: number; video: number };
  rtmp_url?: string;
}>;

export type WSGetRoomAllUserType = IWsFormat<{
  liveUser: { id: any; rooms: any[] }[];
}>;

export type WsRoomLivingType = IWsFormat<{
  live_room: ILiveRoom;
  anchor_socket_id: string;
}>;

export type WsGetLiveUserType = IWsFormat<{
  live_room_id: number;
}>;

export type WsMessageType = IWsFormat<{
  msgType: DanmuMsgTypeEnum;
  msg: string;
  live_room_id: number;
}>;

export type WsOtherJoinType = IWsFormat<{
  live_room: ILiveRoom;
  live_room_user_info: IUser;
  join_user_info?: IUser;
  join_socket_id: string;
}>;

export type WsStartLiveType = IWsFormat<{
  cover_img: string;
  name: string;
  type: LiveRoomTypeEnum;
  chunkDelay: number;
}>;

export type WsJoinType = IWsFormat<{
  socket_id: string;
  live_room: ILiveRoom;
  anchor_info?: IUser;
  user_info?: IUser;
}>;

export type WsLeavedType = IWsFormat<{
  socket_id: string;
  user_info?: IUser;
}>;

export type WsRoomNoLiveType = IWsFormat<{
  live_room: ILiveRoom;
}>;

export type WsOfferType = IWsFormat<{
  sdp: any;
  sender: string;
  receiver: string;
  live_room_id: number;
}>;

export type WsAnswerType = IWsFormat<{
  sdp: any;
  sender: string;
  receiver: string;
  live_room_id: number;
}>;

export type WsHeartbeatType = IWsFormat<{
  socket_id: string;
}>;

export type WsCandidateType = IWsFormat<{
  live_room_id: number;
  candidate: RTCIceCandidate;
  receiver: string;
  sender: string;
}>;

export type WsMsrBlobType = IWsFormat<{
  live_room_id: number;
  blob: any;
  blob_id: string;
  delay: number;
}>;
