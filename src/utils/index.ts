import { getRangeRandom } from 'billd-utils';

export const sum = (a, b) => {
  return a + b;
};

/**
 * @description 获取随机字符串(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)
 * @example: getRandomString(4) ===> abd3
 * @param {number} length
 * @return {*}
 */
export const getRandomString = (length: number): string => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRangeRandom(0, str.length - 1));
  }
  return res;
};

export function videoToCanvas(
  videoElement: HTMLVideoElement,
  targetEl: HTMLElement,
  width: number,
  height
) {
  if (!videoElement || !targetEl) {
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const newVideo = videoElement.cloneNode(false);

  const requestAnimationFrame = window.requestAnimationFrame;
  const cancelAnimationFrame = window.cancelAnimationFrame;
  let timer;

  function drawCanvas() {
    ctx.drawImage(videoElement, 0, 0);
    timer = requestAnimationFrame(drawCanvas);
  }

  function stopDrawing() {
    cancelAnimationFrame(timer);
  }

  newVideo.addEventListener(
    'play',
    function () {
      drawCanvas();
    },
    false
  );
  newVideo.addEventListener('pause', stopDrawing, false);
  newVideo.addEventListener('ended', stopDrawing, false);

  targetEl.parentNode?.replaceChild(canvas, targetEl);

  drawCanvas();

  // this.play = function () {
  //   newVideo.play();
  // };

  // this.pause = function () {
  //   newVideo.pause();
  // };

  // this.playPause = function () {
  //   if (newVideo.paused) {
  //     this.play();
  //   } else {
  //     this.pause();
  //   }
  // };

  // this.change = function (src) {
  //   if (!src) {
  //     return;
  //   }
  //   newVideo.src = src;
  // };

  // this.drawFrame = drawCanvas;
}
