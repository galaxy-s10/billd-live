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
            retry.value = 0;
            setMuted(appStore.muted);
            flvVideoEl.value = videoEl;
            resolve('');
          });
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
      }
      main();
    });
  }

  return { flvPlayer, flvVideoEl, startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const hlsPlayer = ref<Player>();
  const hlsVideoEl = ref<HTMLVideoElement>();
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
    return new Promise((resolve) => {
      function main() {
        console.log('startHlsPlay', data.hlsurl);
        destroyHls();
        const videoEl = createVideo({ muted: appStore.muted, autoplay: true });
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
          setMuted(appStore.muted);
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
          hlsVideoEl.value = videoEl;
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
