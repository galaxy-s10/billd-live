import { defineStore } from 'pinia';

import { MediaTypeEnum } from '@/interface';
import { mobileRouterName } from '@/router';

export type AppRootState = {
  muted: boolean;
  navList: { routeName: string; name: string }[];
  allTrack: {
    /** 1开启；2关闭 */
    audio: number;
    /** 1开启；2关闭 */
    video: number;
    id: string;
    mediaName: string;
    type: MediaTypeEnum;
    track: MediaStreamTrack;
    stream: MediaStream;
    streamid: string;
    trackid: string;
  }[];
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      muted: true,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5Profile, name: '我的' },
      ],
      allTrack: [],
    };
  },
  actions: {
    setMuted(res: AppRootState['muted']) {
      this.muted = res;
    },
    setAllTrack(res: AppRootState['allTrack']) {
      this.allTrack = res;
    },
    isOnlyAudio() {
      let videoTracks = 0;
      this.allTrack.forEach((item) => {
        if (item.video === 1) {
          videoTracks += 1;
        }
      });
      return videoTracks <= 0;
    },
    getTrackInfo() {
      const res = { audio: 0, video: 0 };
      this.allTrack.forEach((item) => {
        res.audio += item.stream.getAudioTracks().length;
        res.video += item.stream.getVideoTracks().length;
      });
      return res;
    },
  },
});
