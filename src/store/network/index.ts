import { defineStore } from 'pinia';

import { WebRTCClass } from '@/utils/network/webRTC';
import { WebSocketClass } from '@/utils/network/webSocket';

type NetworkRootState = {
  wsMap: Map<string, WebSocketClass>;
  rtcMap: Map<string, WebRTCClass>;
};

export const useNetworkStore = defineStore('network', {
  state: (): NetworkRootState => {
    return {
      wsMap: new Map(),
      rtcMap: new Map(),
    };
  },
  actions: {
    removeWs(roomId: string) {
      const old = this.wsMap.get(roomId);
      if (old) {
        old.close();
      }
      this.wsMap.delete(roomId);
    },
    removeRtc(socketId: string) {
      const old = this.rtcMap.get(socketId);
      if (old) {
        old.close();
      }
      this.rtcMap.delete(socketId);
    },
  },
});
