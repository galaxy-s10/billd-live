import { defineStore } from 'pinia';

import { WebRTCClass } from '@/network/webRtc';
import { WebSocketClass } from '@/network/webSocket';

type RootState = {
  wsMap: Map<string, WebSocketClass>;
  rtcMap: Map<string, WebRTCClass>;
  fromUserMap: Map<string, string>;
};

export const useNetworkStore = defineStore('network', {
  state: (): RootState => {
    return {
      wsMap: new Map(),
      rtcMap: new Map(),
      fromUserMap: new Map(),
    };
  },
  actions: {
    updateWsMap(roomId: string, arg) {
      // console.log('updateWsMap', roomId, arg);
      const val = this.wsMap.get(roomId);
      if (val) {
        this.wsMap.set(roomId, { ...val, ...arg });
      } else {
        this.wsMap.set(roomId, arg);
      }
    },
    updateRtcMap(roomId: string, arg) {
      const val = this.rtcMap.get(roomId);
      if (val) {
        this.rtcMap.set(roomId, { ...val, ...arg });
      } else {
        this.rtcMap.set(roomId, arg);
      }
    },
    updateFromUserMap(socketId: string, data) {
      this.fromUserMap.set(socketId, data);
    },
    getRtcMap(roomId: string) {
      return this.rtcMap.get(roomId);
    },
  },
});
