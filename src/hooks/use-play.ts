import '@/assets/css/videojs.scss';
import mpegts from 'mpegts.js';
import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';
import { createVideo } from '@/utils';

export * as flvJs from 'flv.js';

export function useFlvPlay() {
  // const flvPlayer = ref<flvJs.Player>();
  const flvPlayer = ref<mpegts.Player>();
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
    console.log('startFlvPlay', data.flvurl);
    destroyFlv();
    return new Promise<{ width: number; height: number }>((resolve) => {
      if (mpegts.getFeatureList().mseLivePlayback && mpegts.isSupported()) {
        flvPlayer.value = mpegts.createPlayer({
          type: 'flv', // could also be mpegts, m2ts, flv
          isLive: true,
          url: data.flvurl,
        });
        const videoEl = createVideo({ muted: true, autoplay: true });
        videoEl.style.width = `1px`;
        videoEl.style.height = `1px`;
        videoEl.style.position = 'fixed';
        videoEl.style.bottom = '0';
        videoEl.style.right = '0';
        videoEl.style.opacity = '0';
        videoEl.style.pointerEvents = 'none';
        document.body.appendChild(videoEl);
        flvVideoEl.value = videoEl;
        flvVideoEl.value.addEventListener('play', () => {
          console.log('flv-play');
        });
        flvVideoEl.value.addEventListener('playing', () => {
          console.log('flv-playing');
          setMuted(appStore.muted);
          resolve({
            width: flvVideoEl.value?.videoWidth || 0,
            height: flvVideoEl.value?.videoHeight || 0,
          });
        });
        flvPlayer.value.attachMediaElement(flvVideoEl.value);
        flvPlayer.value.load();
        try {
          console.log(`开始播放flv，muted:${appStore.muted}`);
          flvPlayer.value.play();
        } catch (err) {
          console.error('flv播放失败');
          console.log(err);
        }
      } else {
        console.error('不支持flv');
      }
    });
  }

  return { flvPlayer, flvVideoEl, startFlvPlay, destroyFlv };
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
    console.log('startHlsPlay', data.hlsurl);
    destroyHls();
    const videoEl = createVideo({ muted: appStore.muted, autoplay: true });
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
          try {
            console.log(`开始播放hls，muted:${appStore.muted}`);
            hlsPlayer.value?.play();
          } catch (err) {
            console.error('hls播放失败');
            console.log(err);
          }
          hlsPlayer.value?.on('play', () => {
            console.log('hls-play');
            // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是0！
          });
          hlsPlayer.value?.on('playing', () => {
            console.log('hls-playing');
            setMuted(appStore.muted);
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

  return { hlsPlayer, hlsVideoEl, startHlsPlay, destroyHls };
}
