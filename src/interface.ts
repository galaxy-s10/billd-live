// 这里放项目里面的类型
export interface ILive {
  id?: number;
  system?: number;
  socketId?: string;
  roomId?: string;
  roomName?: string;
  coverImg?: string;
  streamurl?: string;
  flvurl?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export enum LiveTypeEnum {
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
  avatar: string;
  expr: number;
}

export interface IDanmu {
  socketId: string;
  msgType: DanmuMsgTypeEnum;
  msg: string;
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
  };
}
