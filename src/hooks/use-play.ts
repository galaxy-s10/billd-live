import flvJs from 'flv.js';

export async function useFlvPlay(flvurl: string, videoEl: HTMLVideoElement) {
  if (flvJs.isSupported()) {
    const flvPlayer = flvJs.createPlayer({
      type: 'flv',
      url: flvurl,
    });
    flvPlayer.attachMediaElement(videoEl);
    flvPlayer.load();
    try {
      await flvPlayer.play();
      return { flvPlayer };
    } catch (err) {
      console.log(err);
      return { err: '播放失败' };
    }
  } else {
    console.error('不支持flv');
    return { err: '不支持flv' };
  }
}
