import { onMounted, onUnmounted, ref } from 'vue';

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

  async function startPlay(data: {
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

  return { startPlay };
}
