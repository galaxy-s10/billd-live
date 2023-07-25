// TIP: ctrl+cmd+t,生成函数注释

import { getRangeRandom } from 'billd-utils';

/**
 * @description 获取随机字符串(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)
 * @example: getRandomString(4) ===> abd3
 * @param {number} length
 * @return {*}
 */
export const getRandomEnglishString = (length: number): string => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRangeRandom(0, str.length - 1));
  }
  return res;
};

export const createVideo = ({ muted = true, autoplay = true }) => {
  const videoEl = document.createElement('video');
  videoEl.autoplay = autoplay;
  videoEl.muted = muted;
  videoEl.playsInline = true;
  videoEl.setAttribute('webkit-playsinline', 'true');
  videoEl.setAttribute('x5-video-player-type', 'h5');
  videoEl.setAttribute('x5-video-player-fullscreen', 'true');
  videoEl.setAttribute('x5-video-orientation', 'portraint');
  videoEl.oncontextmenu = (e) => {
    e.preventDefault();
  };
  // if (NODE_ENV === 'development') {
  videoEl.controls = true;
  // }
  return videoEl;
};

export function videoToCanvas(data: {
  videoEl: HTMLVideoElement;
  targetEl: Element;
  width: number;
  height: number;
}) {
  const { videoEl, targetEl, width, height } = data;
  if (!videoEl || !targetEl) {
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  let timer;

  function drawCanvas() {
    ctx.drawImage(videoEl, 0, 0, width, height);
    timer = requestAnimationFrame(drawCanvas);
  }

  function stopDrawing() {
    cancelAnimationFrame(timer);
  }
  targetEl.appendChild(canvas);
  // document.body.appendChild(videoEl);
  // targetEl.parentNode?.replaceChild(canvas, targetEl);

  drawCanvas();

  return { drawCanvas, stopDrawing };
}
