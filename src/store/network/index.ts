import { defineStore } from 'pinia';

import { WebRTCClass } from '@/network/webRtc';
import { WebSocketClass } from '@/network/webSocket';

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
    updateWsMap(roomId: string, arg) {
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
    getRtcMap(roomId: string) {
      return this.rtcMap.get(roomId);
    },
  },
});
