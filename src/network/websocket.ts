import { Socket, io } from 'socket.io-client';

import { useNetworkStore } from '@/store/network';

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
  /** 人满了 */
  full = 'full',
  /** 用户发送消息 */
  message = 'message',
  /** 管理员在线 */
  adminIn = 'adminIn',
  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',
}

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: WsConnectStatusEnum = WsConnectStatusEnum.disconnect;
  url = '';

  roomId = '-1';
  isAdmin = false;

  constructor({ roomId, url, isAdmin }) {
    if (!window.WebSocket) {
      alert('当前环境不支持WebSocket！');
      return;
    }
    this.roomId = roomId;
    this.isAdmin = isAdmin;

    this.url = url;
    this.socketIo = io(url, { transports: ['websocket'] });
    this.update();

    // // websocket连接成功
    // this.socketIo.on(WsConnectStatusEnum.connect, (socket) => {
    //   console.log('websocket连接成功', socket);
    //   this.status = WsStatusEnum.connect;
    //   this.update();
    //   this.socketIo?.emit(WsMsgTypeEnum.join, { roomId: this.roomId });
    // });

    // // websocket连接断开
    // this.socketIo.on(WsConnectStatusEnum.disconnect, () => {
    //   console.log('websocket连接断开', this);
    //   this.status = WsStatusEnum.disconnect;
    //   this.update();
    // });

    // // 用户加入房间
    // this.socketIo.on(WsMsgTypeEnum.join, (data) => {
    //   console.log('用户加入房间', data);
    // });

    // // 其他用户加入房间
    // this.socketIo.on(WsMsgTypeEnum.otherJoin, (data) => {
    //   console.log('其他用户加入房间', data);
    // });

    // // 用户离开房间
    // this.socketIo.on(WsMsgTypeEnum.leave, (data) => {
    //   console.log('用户离开房间', data);
    // });

    // // 用户发送消息
    // this.socketIo.on(WsMsgTypeEnum.message, (data) => {
    //   console.log('用户发送消息', data);
    // });

    // // 用户发送 offer
    // this.socketIo.on(WsMsgTypeEnum.offer, (data) => {
    //   console.log('用户发送 offer', data);
    // });

    // // 用户发送 answer
    // this.socketIo.on(WsMsgTypeEnum.answer, (data) => {
    //   console.log('用户发送 answer', data);
    // });
  }

  // 发送websocket消息
  send = ({ msgType, data }: { msgType: WsMsgTypeEnum; data?: any }) => {
    console.log('【websocket】发送websocket消息', msgType, data);
    this.socketIo?.emit(msgType, {
      roomId: this.roomId,
      socketId: this.socketIo.id,
      data,
      isAdmin: this.isAdmin,
    });
  };

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.updateWsMap(this.roomId, this);
  };

  // 手动关闭websocket连接
  close = () => {
    console.warn('手动关闭websocket连接', this.socketIo?.id);
    this.socketIo?.close();
  };

  // 连接websocket
  connect = () => {};
}
