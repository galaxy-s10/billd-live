import { UploadFileInfo } from 'naive-ui';
import { defineStore } from 'pinia';

import {
  IArea,
  LiveLineEnum,
  LiveRenderEnum,
  MediaTypeEnum,
} from '@/interface';
import { mobileRouterName } from '@/router';
import { ILiveRoom } from '@/types/ILiveRoom';
import { isMSESupported } from '@/utils';

export type AppRootState = {
  pageIsClick: boolean;
  useGoogleAd: boolean;
  usePayCourse: boolean;
  areaList: IArea[];
  playing: boolean;
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
    openEye: boolean;
    track?: MediaStreamTrack;
    stream?: MediaStream;
    streamid?: string;
    trackid?: string;
    canvasDom?: any;
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
  videoControls: {
    pipMode?: boolean;
    pageFullMode?: boolean;
    fullMode?: boolean;
    renderMode?: LiveRenderEnum;
    line?: boolean;
    speed?: boolean;
    networkSpeed?: boolean;
    fps?: boolean;
    kbs?: boolean;
    resolution?: boolean;
  };
  videoControlsValue: {
    pipMode?: boolean;
    pageFullMode?: boolean;
    kbs?: string;
    fps?: number;
  };
  mseSupport: boolean;
  liveLine: LiveLineEnum;
  liveRoomInfo?: ILiveRoom;
  showLoginModal: boolean;
  disableSpeaking: Map<number, { exp: number; label: string }>;
  showSigninRedDot: boolean;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      pageIsClick: false,
      useGoogleAd: false,
      usePayCourse: false,
      areaList: [],
      playing: false,
      videoRatio: 16 / 9,
      videoControls: {
        renderMode: LiveRenderEnum.video,
      },
      videoControlsValue: {
        pipMode: false,
      },
      normalVolume: 80,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Shop, name: '商店' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5My, name: '我的' },
      ],
      allTrack: [],
      mseSupport: isMSESupported(),
      liveLine: isMSESupported() ? LiveLineEnum.flv : LiveLineEnum.hls,
      liveRoomInfo: undefined,
      showLoginModal: false,
      disableSpeaking: new Map(),
      showSigninRedDot: false,
    };
  },
  actions: {
    setLiveRoomInfo(res: AppRootState['liveRoomInfo']) {
      this.liveRoomInfo = res;
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
