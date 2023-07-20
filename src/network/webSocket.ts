import { Socket, io } from 'socket.io-client';

import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';

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
  roomLiveing = 'roomLiveing',
  /** 房间不在直播 */
  roomNoLive = 'roomNoLive',
  /** sendBlob */
  sendBlob = 'sendBlob',
  /** getLiveUser */
  getLiveUser = 'getLiveUser',
  /** updateJoinInfo */
  updateJoinInfo = 'updateJoinInfo',
  /** heartbeat */
  heartbeat = 'heartbeat',
  offer = 'offer',
  answer = 'answer',
  candidate = 'candidate',
}

export function prettierReceiveWebsocket(...arg) {
  console.warn('【websocket】收到消息', ...arg);
}

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: WsConnectStatusEnum = WsConnectStatusEnum.disconnect;
  url = '';
  roomId = '-1';
  isAnchor = false;

  constructor(data: { roomId: string; url: string; isAnchor: boolean }) {
    if (!window.WebSocket) {
      alert('当前环境不支持WebSocket！');
      return;
    }
    console.warn('开始new WebSocketClass', data);
    this.roomId = data.roomId;
    this.isAnchor = data.isAnchor;
    this.url = data.url;
    this.socketIo = io(data.url, {
      transports: ['websocket'],
      forceBase64: false,
    });
    this.update();
  }

  // 发送websocket消息
  send = ({ msgType, data }: { msgType: WsMsgTypeEnum; data?: any }) => {
    if (!this.socketIo?.connected) {
      console.error(
        '【websocket】未连接成功，不发送websocket消息！',
        msgType,
        data
      );
      return;
    }
    console.warn('【websocket】发送消息', msgType, data);
    const userStore = useUserStore();
    const sendData = {
      socket_id: this.socketIo.id,
      is_anchor: this.isAnchor,
      user_info: userStore.userInfo,
      data,
    };
    this.socketIo?.emit(msgType, sendData);
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
}
