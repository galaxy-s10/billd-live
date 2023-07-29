import '@/assets/css/videojs.scss';
import flvJs from 'flv.js';
import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';
import { createVideo } from '@/utils';

export * as flvJs from 'flv.js';

export function useFlvPlay() {
  const flvPlayer = ref<flvJs.Player>();
  const flvVideoEl = ref<HTMLVideoElement>();
  const appStore = useAppStore();

  onMounted(() => {});

  onUnmounted(() => {
    destroyFlv();
  });

  function destroyFlv() {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
    }
    flvVideoEl.value?.remove();
  }

  watch(
    () => appStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );

  function setMuted(val) {
    if (flvPlayer.value) {
      flvPlayer.value.muted = val;
    }
    if (flvVideoEl.value) {
      flvVideoEl.value.muted = val;
    }
  }

  function startFlvPlay(data: { flvurl: string }) {
    destroyFlv();
    return new Promise<{ width: number; height: number }>((resolve) => {
      setTimeout(() => {
        if (flvJs.isSupported()) {
          flvPlayer.value = flvJs.createPlayer({
            type: 'flv',
            url: data.flvurl,
          });
          const videoEl = createVideo({ muted: true, autoplay: true });
          flvVideoEl.value = videoEl;
          flvVideoEl.value.addEventListener('play', () => {
            console.log('flv-play');
          });
          flvVideoEl.value.addEventListener('playing', () => {
            console.log(
              'flv-playing',
              flvVideoEl.value?.videoWidth,
              flvVideoEl.value?.videoHeight
            );
            // setMuted(false);
            setMuted(appStore.muted);
            resolve({
              width: flvVideoEl.value?.videoWidth || 0,
              height: flvVideoEl.value?.videoHeight || 0,
            });
          });
          flvPlayer.value.attachMediaElement(flvVideoEl.value);
          flvPlayer.value.load();
          try {
            console.log('开始播放flv');
            flvPlayer.value.play();
          } catch (err) {
            console.error('flv播放失败');
            console.log(err);
          }
        } else {
          console.error('不支持flv');
        }
      }, 500);
    });
  }

  return { flvVideoEl, startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const hlsPlayer = ref<Player>();
  const hlsVideoEl = ref<HTMLVideoElement>();
  const appStore = useAppStore();

  onMounted(() => {});

  onUnmounted(() => {
    destroyHls();
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
    }
    hlsVideoEl.value?.remove();
  }

  function setMuted(val) {
    console.log('setMuted', val);
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
    const videoEl = createVideo({ muted: appStore.muted, autoplay: true });
    hlsVideoEl.value = videoEl;
    // document.body.appendChild(videoEl);
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
            console.log('hls-play');
            // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是0！
          });
          hlsPlayer.value?.on('playing', () => {
            console.log('hls-playing');
            appStore.setMuted(hlsVideoEl.value?.muted || false);
            // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是正确的！
            const childNodes = hlsPlayer.value?.el().childNodes;
            if (childNodes) {
              childNodes.forEach((item) => {
                if (item.nodeName.toLowerCase() === 'video') {
                  // @ts-ignore
                  hlsVideoEl.value = item;
                }
              });
            }
            resolve({
              width: hlsPlayer.value?.videoWidth() || 0,
              height: hlsPlayer.value?.videoHeight() || 0,
            });
          });
          hlsPlayer.value?.on('loadedmetadata', () => {
            console.log('hls-loadedmetadata');
          });
        }
      );
    });
  }

  return { hlsVideoEl, startHlsPlay, destroyHls };
}
