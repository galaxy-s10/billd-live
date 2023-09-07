import { defineStore } from 'pinia';

import { ILiveRoom, LiveLineEnum, MediaTypeEnum } from '@/interface';
import { mobileRouterName } from '@/router';

export type AppRootState = {
  muted: boolean;
  videoRatio: number;
  navList: { routeName: string; name: string }[];
  allTrack: {
    /** 1开启；2关闭 */
    audio: number;
    /** 1开启；2关闭 */
    video: number;
    id: string;
    mediaName: string;
    type: MediaTypeEnum;
    track?: MediaStreamTrack;
    stream?: MediaStream;
    streamid?: string;
    trackid?: string;
    canvasDom?: fabric.Image | fabric.Text;
    hidden?: boolean;
    muted?: boolean;
    volume?: number;
    videoEl?: HTMLVideoElement;
    txtInfo?: { txt: string; color: string };
    timeInfo?: { color: string };
    stopwatchInfo?: { color: string };
    rect?: { top: number; left: number };
    scaleInfo: Record<number, { scaleX: number; scaleY: number }>;
  }[];
  liveLine: LiveLineEnum;
  liveRoomInfo?: ILiveRoom;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      muted: true,
      videoRatio: 16 / 9,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5Profile, name: '我的' },
      ],
      allTrack: [],
      liveLine: LiveLineEnum.hls,
      liveRoomInfo: undefined,
    };
  },
  actions: {
    setLiveRoomInfo(res: AppRootState['liveRoomInfo']) {
      this.liveRoomInfo = res;
    },
    setLiveLine(res: AppRootState['liveLine']) {
      this.liveLine = res;
    },
    setMuted(res: AppRootState['muted']) {
      this.muted = res;
    },
    setAllTrack(res: AppRootState['allTrack']) {
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
