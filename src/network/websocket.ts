import { Socket, io } from 'socket.io-client';

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

export class WebSocketClass {
  wsInstance: Socket | null = null;
  wsUrl = 'ws://localhost:3300';

  constructor({ url }) {
    if (!window.WebSocket) {
      console.error('当前环境不支持WebSocket！');
      alert('当前环境不支持WebSocket！');
      return;
    }
    this.wsUrl = url;
    this.wsInstance = io(url, { transports: ['websocket'] });
    // 连接websocket成功
    this.wsInstance.on(wsConnectStatus.connect, (socket: Socket) => {
      console.log('连接websocket成功', socket);
    });
    // 用户加入房间
    this.wsInstance.on('join', (data) => {
      console.log('用户加入房间', data);
    });
    // 用户离开房间
    this.wsInstance.on('leave', (data) => {
      console.log('用户离开房间', data);
    });
    // 监听连接断开
    this.wsInstance.on('disconnect', () => {
      console.log('监听连接断开');
    });
    // 用户发送 offer
    this.wsInstance.on('offer', (data) => {
      console.log('用户发送 offer', data);
    });
    // 用户发送 answer
    this.wsInstance.on('answer', (data) => {
      console.log('用户发送 answer', data);
    });
    // 用户发送消息
    this.wsInstance.on('message', (data) => {
      console.log('用户发送消息', data);
    });
  }

  // 发送websocket消息
  send = () => {};

  // 手动关闭websocket连接
  close = () => {};

  // 连接websocket
  connect = () => {};
}
