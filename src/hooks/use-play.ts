import '@/assets/css/videojs.scss';
import mpegts from 'mpegts.js';
import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { createVideo } from '@/utils';

export * as flvJs from 'flv.js';

export function useFlvPlay() {
  // const flvPlayer = ref<flvJs.Player>();
  const flvPlayer = ref<mpegts.Player>();
  const flvVideoEl = ref<HTMLVideoElement>();
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const retryMax = ref(120);
  const retry = ref(0);
  const retrying = ref(false);

  onMounted(() => {});

  onUnmounted(() => {
    destroyFlv();
  });

  function destroyFlv() {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
      flvPlayer.value = undefined;
    }
    flvVideoEl.value?.remove();
  }

  function setMuted(val) {
    if (flvVideoEl.value) {
      flvVideoEl.value.muted = val;
    }
    if (flvPlayer.value) {
      flvPlayer.value.muted = val;
    }
  }
  function setVolume(val: number) {
    if (flvVideoEl.value) {
      flvVideoEl.value.volume = val / 100;
    }
    if (flvPlayer.value) {
      flvPlayer.value.volume = val / 100;
    }
  }
  function setPlay(val: boolean) {
    if (val) {
      flvVideoEl.value?.play();
      flvPlayer.value?.play();
    } else {
      flvVideoEl.value?.pause();
      flvPlayer.value?.pause();
    }
  }

  watch(
    () => cacheStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );
  watch(
    () => cacheStore.volume,
    (newVal) => {
      setVolume(newVal);
    }
  );
  watch(
    () => appStore.play,
    (newVal) => {
      setPlay(newVal);
    }
  );

  function startFlvPlay(data: { flvurl: string }) {
    console.log('startFlvPlay', data.flvurl);
    return new Promise((resolve) => {
      function main() {
        destroyFlv();
        if (mpegts.getFeatureList().mseLivePlayback && mpegts.isSupported()) {
          flvPlayer.value = mpegts.createPlayer({
            type: 'flv', // could also be mpegts, m2ts, flv
            isLive: true,
            url: data.flvurl,
          });
          const videoEl = createVideo({});
          videoEl.addEventListener('play', () => {
            console.log('flv-play');
          });
          videoEl.addEventListener('playing', () => {
            console.log('flv-playing');
            retry.value = 0;
            setMuted(cacheStore.muted);
            flvVideoEl.value = videoEl;
            resolve('');
          });
          videoEl.addEventListener('loadedmetadata', () => {
            console.log('flv-loadedmetadata');
          });
          flvPlayer.value.attachMediaElement(videoEl);
          flvPlayer.value.load();
          flvPlayer.value.on(mpegts.Events.ERROR, () => {
            console.error('mpegts消息：mpegts.Events.ERROR');
            if (retry.value < retryMax.value && !retrying.value) {
              retrying.value = true;
              destroyFlv();
              setTimeout(() => {
                console.error(
                  '播放flv错误，重新加载，剩余次数：',
                  retryMax.value - retry.value
                );
                retry.value += 1;
                retrying.value = false;
                main();
              }, 1000);
            }
          });
          flvPlayer.value.on(mpegts.Events.MEDIA_INFO, () => {
            console.log('mpegts消息：mpegts.Events.MEDIA_INFO');
          });
          try {
            console.log(`开始播放flv，muted:${cacheStore.muted}`);
            flvPlayer.value.play();
          } catch (err) {
            console.error('flv播放失败');
            console.log(err);
          }
        } else {
          console.error('不支持flv');
        }
      }
      main();
    });
  }

  return { flvPlayer, flvVideoEl, startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const hlsPlayer = ref<Player>();
  const hlsVideoEl = ref<HTMLVideoElement>();
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const retryMax = ref(120);
  const retry = ref(0);
  const retrying = ref(false);

  onMounted(() => {});

  onUnmounted(() => {
    destroyHls();
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
      hlsPlayer.value = undefined;
    }
    hlsVideoEl.value?.remove();
  }

  function setMuted(val: boolean) {
    if (hlsVideoEl.value) {
      hlsVideoEl.value.muted = val;
    }
    if (hlsPlayer.value) {
      hlsPlayer.value.muted(val);
    }
  }
  function setVolume(val: number) {
    if (hlsVideoEl.value) {
      hlsVideoEl.value.volume = val / 100;
    }
    if (hlsPlayer.value) {
      hlsPlayer.value.volume(val / 100);
    }
  }
  function setPlay(val: boolean) {
    if (val) {
      hlsVideoEl.value?.play();
      hlsPlayer.value?.play();
    } else {
      hlsVideoEl.value?.pause();
      hlsPlayer.value?.pause();
    }
  }

  watch(
    () => cacheStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );
  watch(
    () => cacheStore.volume,
    (newVal) => {
      setVolume(newVal);
    }
  );
  watch(
    () => appStore.play,
    (newVal) => {
      setPlay(newVal);
    }
  );

  function startHlsPlay(data: { hlsurl: string }) {
    return new Promise((resolve) => {
      function main() {
        console.log('startHlsPlay', data.hlsurl);
        destroyHls();
        const videoEl = createVideo({
          muted: cacheStore.muted,
          autoplay: true,
        });
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
              console.log(`开始播放hls，muted:${cacheStore.muted}`);
              hlsPlayer.value?.play();
            } catch (err) {
              console.error('hls播放失败');
              console.log(err);
            }
          }
        );
        hlsPlayer.value?.on('error', () => {
          console.log('hls-error');
          if (retry.value < retryMax.value && !retrying.value) {
            retrying.value = true;
            setTimeout(() => {
              console.error(
                '播放hls错误，重新加载，剩余次数：',
                retryMax.value - retry.value
              );
              retry.value += 1;
              retrying.value = false;
              main();
            }, 1000);
          }
        });
        hlsPlayer.value?.on('play', () => {
          console.log('hls-play');
          // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是0！
        });
        hlsPlayer.value?.on('playing', () => {
          console.log('hls-playing');
          setMuted(cacheStore.muted);
          retry.value = 0;
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
          resolve('');
        });
        hlsPlayer.value?.on('loadedmetadata', () => {
          console.log('hls-loadedmetadata');
        });
      }
      main();
    });
  }

  return { hlsPlayer, hlsVideoEl, startHlsPlay, destroyHls };
}
