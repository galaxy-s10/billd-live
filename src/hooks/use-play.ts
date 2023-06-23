import '@/assets/css/videojs.scss';

import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';

// @ts-ignore
export const flvJs = window.flvjs;

export function useFlvPlay() {
  const flvPlayer = ref();

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

  return { startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const hlsPlayer = ref<Player>();
  const videoEl = ref<HTMLVideoElement>();
  const appStore = useAppStore();

  onMounted(() => {});

  onUnmounted(() => {
    destroyHls();
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
      videoEl.value?.remove();
    }
  }

  watch(
    () => appStore.muted,
    (newVal) => {
      if (videoEl.value) {
        videoEl.value.muted = newVal;
      }
    }
  );

  function startHlsPlay(data: { hlsurl: string; videoEl: HTMLVideoElement }) {
    destroyHls();
    const newVideo = document.createElement('video');
    newVideo.muted = true;
    newVideo.playsInline = true;
    newVideo.setAttribute('webkit-playsinline', 'true');
    videoEl.value = newVideo;
    data.videoEl.parentElement?.appendChild(newVideo);
    return new Promise((resolve) => {
      hlsPlayer.value = videoJs(
        newVideo,
        {
          sources: [
            {
              src: data.hlsurl,
              type: 'application/x-mpegURL',
            },
          ],
          controls: false,
          preload: 'auto',
        },
        function onPlayerReady() {
          console.log('Your player is ready!');

          // @ts-ignore
          this.play();
          resolve('ok');
          setTimeout(() => {
            newVideo.muted = false;
            appStore.setMuted(false);
          }, 0);

          // @ts-ignore
          this.on('ended', function () {
            console.log('Awww...over so soon?!');
          });
        }
      );
    });
  }

  return { startHlsPlay, destroyHls };
}
