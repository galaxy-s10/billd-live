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
  document.body.appendChild(videoEl);
  // targetEl.parentNode?.replaceChild(canvas, targetEl);

  drawCanvas();

  return { drawCanvas, stopDrawing };
}
