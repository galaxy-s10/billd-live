// 这里放项目里面的类型
export enum liveTypeEnum {
  camera,
  screen,
}

export interface IAdminIn {
  roomId: string;
  socketId: string;
  isAdmin: boolean;
  data: any;
}
