// TIP: ctrl+cmd+t,生成函数注释

import { getRangeRandom } from 'billd-utils';

/**
 * 格式化倒计时
 * @param endTime
 * @param startTime
 */
export function formatDownTime(endTime: number, startTime: number) {
  const times = (endTime - startTime) / 1000;
  // js获取剩余天数
  const d = parseInt(String(times / 60 / 60 / 24));
  // js获取剩余小时
  let h = parseInt(String((times / 60 / 60) % 24));
  // js获取剩余分钟
  let m = parseInt(String((times / 60) % 60));
  // js获取剩余秒
  let s = parseInt(String(times % 60));
  let ms = new Date(endTime).getMilliseconds();

  if (h < 10) {
    // @ts-ignore
    h = `0${h}`;
  }
  if (m < 10) {
    // @ts-ignore
    m = `0${m}`;
  }
  if (s < 10) {
    // @ts-ignore
    s = `0${s}`;
  }
  if (Number(ms) < 100) {
    if (ms < 10) {
      // @ts-ignore
      ms = `00${ms}`;
    } else {
      // @ts-ignore
      ms = `0${ms}`;
    }
  }
  if (d > 0) {
    return `${d}天${h}时${m}分${s}秒${ms}毫秒`;
  } else if (h > 0) {
    return `${h}时${m}分${s}秒${ms}毫秒`;
  } else {
    return `${m}分${s}秒${ms}毫秒`;
  }
}

/**
 * requestFileSystem保存文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function saveFile(data: { file: File; fileName: string }) {
  return new Promise<{ code: number }>((resolve) => {
    const { file, fileName } = data;
    const requestFileSystem =
      // @ts-ignore
      window.requestFileSystem || window.webkitRequestFileSystem;
    if (!requestFileSystem) {
      console.error('不支持requestFileSystem');
      resolve({ code: 2 });
      return;
    }
    function onError(err) {
      console.error('saveFile错误', data.fileName);
      console.log(err);
      resolve({ code: 2 });
    }
    function onFs(fs) {
      // 创建文件
      fs.root.getFile(
        fileName,
        { create: true },
        (fileEntry) => {
          // 创建文件写入流
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = () => {
              // 完成后关闭文件
              fileWriter.abort();
              resolve({ code: 1 });
            };
            // 写入文件内容
            fileWriter.write(file);
          });
        },
        onError
      );
    }
    // Opening a file system with temporary storage
    requestFileSystem(
      // @ts-ignore
      window.PERSISTENT,
      0,
      onFs,
      onError
    );
  });
}

/**
 * requestFileSystem读取文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function readFile(fileName: string) {
  return new Promise<{ code: number; file?: File }>((resolve) => {
    const requestFileSystem =
      // @ts-ignore
      window.requestFileSystem || window.webkitRequestFileSystem;
    if (!requestFileSystem) {
      console.error('不支持requestFileSystem');
      resolve({ code: 2 });
      return;
    }
    function onError(err) {
      console.error('readFile错误', fileName);
      console.log(err);
      resolve({ code: 2 });
    }
    function onFs(fs) {
      fs.root.getFile(
        fileName,
        {},
        (fileEntry) => {
          fileEntry.file(function (file) {
            resolve({ code: 1, file });
          }, onError);
        },
        onError
      );
    }
    // Opening a file system with temporary storage
    requestFileSystem(
      // @ts-ignore
      window.PERSISTENT,
      0,
      onFs,
      onError
    );
  });
}

export function generateBase64(dom: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  // @ts-ignore
  const { width, height } = dom.getBoundingClientRect();
  const rate = width / height;
  let ratio = 0.5;
  function geturl() {
    const coverWidth = width * ratio;
    const coverHeight = coverWidth / rate;
    canvas.width = coverWidth;
    canvas.height = coverHeight;
    canvas.getContext('2d')!.drawImage(dom, 0, 0, coverWidth, coverHeight);
    // webp比png的体积小非常多！因此coverWidth就可以不用压缩太夸张
    return canvas.toDataURL('image/webp');
  }
  let dataURL = geturl();
  while (dataURL.length > 1000 * 20) {
    ratio = ratio * 0.8;
    dataURL = geturl();
  }
  return dataURL;
}

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

export const createVideo = ({
  muted = true,
  autoplay = true,
  appendChild = false,
}) => {
  const videoEl = document.createElement('video');
  videoEl.autoplay = autoplay;
  videoEl.muted = muted;
  videoEl.playsInline = true;
  videoEl.loop = true;
  videoEl.controls = true;
  videoEl.setAttribute('webkit-playsinline', 'true');
  videoEl.setAttribute('x5-video-player-type', 'h5');
  videoEl.setAttribute('x5-video-player-fullscreen', 'true');
  videoEl.setAttribute('x5-video-orientation', 'portraint');
  videoEl.oncontextmenu = (e) => {
    e.preventDefault();
  };
  if (appendChild) {
    videoEl.style.width = `1px`;
    videoEl.style.height = `1px`;
    videoEl.style.position = 'fixed';
    videoEl.style.bottom = '0';
    videoEl.style.right = '0';
    videoEl.style.opacity = '0';
    videoEl.style.pointerEvents = 'none';
    document.body.appendChild(videoEl);
  }
  return videoEl;
};

export function videoToCanvas(data: {
  videoEl: HTMLVideoElement;
  size?: { width: number; height: number };
}) {
  const { videoEl } = data;
  if (!videoEl) {
    throw new Error('videoEl不能为空！');
  }
  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d')!;
  let timer = -1;
  function drawCanvas() {
    if (data.size) {
      const { width, height } = data.size;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(videoEl, 0, 0, width, height);
      // console.log('有size', width, height, performance.now());
    } else {
      // WARN safari没有captureStream方法
      const videoTrack = videoEl
        // @ts-ignore
        .captureStream()
        .getVideoTracks()[0];
      if (videoTrack) {
        const { width, height } = videoTrack.getSettings();
        canvas.width = width!;
        canvas.height = height!;
        ctx.drawImage(videoEl, 0, 0, width!, height!);
        // console.log('没有size', width, height, performance.now());
      }
    }

    timer = requestAnimationFrame(drawCanvas);
  }

  function stopDrawing() {
    // if (timer !== -1) {
    //   workerTimers.clearInterval(timer);
    // }
    cancelAnimationFrame(timer);
  }

  // const delay = 1000 / 60; // 16.666666666666668
  // timer = workerTimers.setInterval(() => {
  //   drawCanvas();
  // }, delay);

  drawCanvas();

  return { drawCanvas, stopDrawing, canvas, videoEl };
}
