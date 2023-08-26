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
  const retryMax = ref(30);
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
    return new Promise<{ width: number; height: number }>((resolve) => {
      function main() {
        destroyFlv();
        if (mpegts.getFeatureList().mseLivePlayback && mpegts.isSupported()) {
          flvPlayer.value = mpegts.createPlayer({
            type: 'flv', // could also be mpegts, m2ts, flv
            isLive: true,
            url: data.flvurl,
          });
          flvPlayer.value.on(mpegts.Events.ERROR, () => {
            console.log('ERRORERROR');
            if (retry.value < retryMax.value && !retrying.value) {
              retrying.value = true;
              destroyFlv();
              setTimeout(() => {
                console.log(
                  '播放flv错误，重新加载，剩余次数：',
                  retryMax.value - retry.value
                );
                retry.value += 1;
                retrying.value = false;
                main();
              }, 1000);
            }
          });
          const videoEl = createVideo({});
          flvVideoEl.value = videoEl;
          flvVideoEl.value.addEventListener('play', () => {
            console.log('flv-play');
          });
          flvVideoEl.value.addEventListener('playing', () => {
            console.log('flv-playing');
            retry.value = 0;
            setMuted(appStore.muted);
            document.body.appendChild(videoEl);
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
    return new Promise<{ width: number; height: number }>((resolve) => {
      function main() {
        console.log('startHlsPlay', data.hlsurl);
        destroyHls();
        const videoEl = createVideo({ muted: appStore.muted, autoplay: true });
        hlsVideoEl.value = videoEl;
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
        hlsPlayer.value?.on('play', () => {
          console.log('hls-play');
          // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是0！
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
