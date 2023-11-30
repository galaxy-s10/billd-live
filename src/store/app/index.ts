import { UploadFileInfo } from 'naive-ui';
import { defineStore } from 'pinia';

import { ILiveRoom, LiveLineEnum, MediaTypeEnum } from '@/interface';
import { mobileRouterName } from '@/router';

export type AppRootState = {
  play: boolean;
  videoRatio: number;
  normalVolume: number;
  navList: { routeName: string; name: string }[];
  allTrack: {
    /** 1开启；2关闭 */
    audio: number;
    /** 1开启；2关闭 */
    video: number;
    id: string;
    deviceId?: string;
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
    imgInfo?: UploadFileInfo[];
    mediaInfo?: UploadFileInfo[];
    txtInfo?: { txt: string; color: string };
    timeInfo?: { color: string };
    stopwatchInfo?: { color: string };
    rect?: { top: number; left: number };
    scaleInfo: Record<number, { scaleX: number; scaleY: number }>;
  }[];
  liveLine: LiveLineEnum;
  liveRoomInfo?: ILiveRoom;
  showLoginModal: boolean;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      play: true,
      videoRatio: 16 / 9,
      normalVolume: 70,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5Profile, name: '我的' },
      ],
      allTrack: [],
      liveLine: LiveLineEnum.hls,
      liveRoomInfo: undefined,
      showLoginModal: false,
    };
  },
  actions: {
    setLiveRoomInfo(res: AppRootState['liveRoomInfo']) {
      this.liveRoomInfo = res;
    },
    setLiveLine(res: AppRootState['liveLine']) {
      this.liveLine = res;
    },
    setPlay(res: AppRootState['play']) {
      this.play = res;
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
