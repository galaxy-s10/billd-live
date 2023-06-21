import 'video.js/dist/video-js.min.css';

import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useAppStore } from '@/store/app';
// @ts-ignore
const flvJs = window.flvjs;

export function useFlvPlay() {
  const flvPlayer = ref();

  onMounted(() => {});

  onUnmounted(() => {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
    }
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
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
    }
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
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
    }
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
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
    console.log('startHlsPlay', data.hlsurl);
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
    }
    const appStore = useAppStore();
    const newVideo = document.createElement('video');
    newVideo.muted = appStore.muted;
    videoEl.value = newVideo;
    data.videoEl.parentElement?.appendChild(newVideo);
    return new Promise((resolve, reject) => {
      hlsPlayer.value = videoJs(
        newVideo,
        {
          sources: [
            {
              src: data.hlsurl,
              type: 'application/x-mpegURL',
            },
          ],
        },
        function onPlayerReady() {
          console.log('Your player is ready!');
          // @ts-ignore
          this.play();
          resolve('ok');
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
