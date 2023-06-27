import '@/assets/css/videojs.scss';
import flvJs from 'flv.js';
import * as m3u8Parser from 'm3u8-parser';
import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';

export * as flvJs from 'flv.js';

// @ts-ignore
// export const flvJs = window.flvjs as flvJs;

export function useFlvPlay() {
  const flvPlayer = ref<flvJs.Player>();

  onMounted(() => {});

  onUnmounted(() => {
    destroyFlv();
  });

  function destroyFlv() {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
    }
  }

  async function startFlvPlay(data: {
    flvurl: string;
    videoEl: HTMLVideoElement;
  }) {
    destroyFlv();
    if (flvJs.isSupported()) {
      const player = flvJs.createPlayer({
        type: 'flv',
        url: data.flvurl,
      });
      player.attachMediaElement(data.videoEl);
      player.load();
      try {
        await player.play();
        flvPlayer.value = player;
      } catch (err) {
        console.error('flv播放失败');
        console.log(err);
      }
    } else {
      console.error('不支持flv');
    }
  }

  return { flvPlayer, startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const hlsPlayer = ref<Player>();
  const hlsVideoEl = ref<HTMLVideoElement>();
  const appStore = useAppStore();
  const parser = new m3u8Parser.Parser();
  console.log(parser, '====');
  onMounted(() => {});

  onUnmounted(() => {
    destroyHls();
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
      hlsVideoEl.value?.remove();
    }
  }

  function setMuted(val) {
    if (hlsVideoEl.value) {
      hlsVideoEl.value.muted = val;
    }
    if (hlsPlayer.value) {
      hlsPlayer.value.muted(val);
    }
  }

  watch(
    () => appStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );

  function startHlsPlay(data: { hlsurl: string }) {
    destroyHls();
    const videoEl = document.createElement('video');
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.setAttribute('webkit-playsinline', 'true');
    hlsVideoEl.value = videoEl;
    return new Promise<{ width: number; height: number }>((resolve) => {
      hlsPlayer.value = videoJs(
        videoEl,
        {
          sources: [
            {
              src: data.hlsurl,
              type: 'application/x-mpegURL',
            },
          ],
        },
        function () {
          console.log('开始播放hls');
          hlsPlayer.value?.play();

          hlsPlayer.value?.on('play', () => {
            console.log('play', hlsPlayer.value?.videoHeight()); // 获取到的是0！
          });

          hlsPlayer.value?.on('playing', () => {
            console.log('playing', hlsPlayer.value?.videoHeight()); // 获取到的是正确的！
            setTimeout(() => {
              videoEl.muted = false;
              appStore.setMuted(false);
            }, 0);
            resolve({
              width: hlsPlayer.value?.videoWidth() || 0,
              height: hlsPlayer.value?.videoHeight() || 0,
            });
          });

          hlsPlayer.value?.on('loadedmetadata', (e) => {
            console.log('loadedmetadata', e);
          });
        }
      );
    });
  }

  return { hlsVideoEl, startHlsPlay, destroyHls };
}
