import { Socket, io } from 'socket.io-client';

import { useNetworkStore } from '@/store/network';

// websocket连接状态
export const wsConnectStatus = {
  /** 已连接 */
  connection: 'connection',
  /** 连接中 */
  connecting: 'connecting',
  /** 已连接 */
  connected: 'connected',
  /** 断开连接中 */
  disconnecting: 'disconnecting',
  /** 已断开连接 */
  disconnect: 'disconnect',
  /** 重新连接 */
  reconnect: 'reconnect',
  /** 客户端的已连接 */
  connect: 'connect',
};

// websocket消息类型
export const wsMsgType = {
  /** 用户进入聊天 */
  join: 'join',
  /** 用户退出聊天 */
  leave: 'leave',
  /** 用户发送消息 */
  message: 'message',
};

enum statusEnum {
  connect = 'connect',
  disconnect = 'disconnect',
}

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: statusEnum = statusEnum.connect;

  url = 'ws://localhost:3300';
  roomId = '-1';

  constructor({ roomId, url }) {
    if (!window.WebSocket) {
      console.error('当前环境不支持WebSocket！');
      alert('当前环境不支持WebSocket！');
      return;
    }
    this.roomId = roomId;
    this.url = url;
    this.socketIo = io(url, { transports: ['websocket'] });
    // websocket连接成功
    this.socketIo.on(wsConnectStatus.connect, (socket) => {
      console.log('websocket连接成功', socket);
      this.status = statusEnum.connect;
      this.update();
      // socket.join(this.roomId);
    });

    // websocket连接断开
    this.socketIo.on(wsConnectStatus.disconnect, () => {
      console.log('websocket连接断开', this);
      this.status = statusEnum.disconnect;
      this.update();
    });

    // 用户加入房间
    this.socketIo.on(wsMsgType.join, (data) => {
      console.log('用户加入房间', data);
    });
    // 用户离开房间
    this.socketIo.on(wsMsgType.leave, (data) => {
      console.log('用户离开房间', data);
    });
    // 用户发送消息
    this.socketIo.on(wsMsgType.message, (data) => {
      console.log('用户发送消息', data);
    });

    // 用户发送 offer
    this.socketIo.on('offer', (data) => {
      console.log('用户发送 offer', data);
    });
    // 用户发送 answer
    this.socketIo.on('answer', (data) => {
      console.log('用户发送 answer', data);
    });
  }

  // 发送websocket消息
  send = () => {};

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.updateWsMap(this.roomId, this);
  };

  // 手动关闭websocket连接
  close = () => {
    console.warn('手动关闭websocket连接');
    this.socketIo?.close();
  };

  // 连接websocket
  connect = () => {};
}
