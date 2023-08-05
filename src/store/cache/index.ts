import { defineStore } from 'pinia';

import { MediaTypeEnum } from '@/interface';

export type AppCacheRootState = {
  allTrack: {
    /** 1开启；2关闭 */
    audio: number;
    /** 1开启；2关闭 */
    video: number;
    id: string;
    mediaName: string;
    type: MediaTypeEnum;
    muted?: boolean;
    track?: MediaStreamTrack;
    stream?: MediaStream;
    streamid: string;
    trackid: string;
    canvasDom?: fabric.Image;
    initScale?: number;
    hidden?: boolean;
  }[];
};
export const useAppCacheStore = defineStore('appCache', {
  persist: {
    key: 'appCache',
  },
  state: (): AppCacheRootState => {
    return {
      allTrack: [], // 当前是否横屏
    };
  },
  actions: {
    setAllTrack(res: AppCacheRootState['allTrack']) {
      this.allTrack = res;
    },
    getTrackInfo() {
      const res = { audio: 0, video: 0 };
      this.allTrack.forEach((item) => {
        // if (item.stream) {
        if (item.audio === 1) {
          res.audio += 1;
        }
        if (item.video === 1) {
          res.video += 1;
        }
        // }
      });
      return res;
    },
  },
});
