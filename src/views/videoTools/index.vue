<template>
  total:{{ total }}, videoFrameTotal:{{ videoFrameTotal }}
  <canvas ref="canvasRef"></canvas>
  <div
    class="frane-list"
    ref="wrapRef"
  ></div>
  <div
    class="ico img"
    title="图片"
    @click.stop="handleVideoFrameByCanvas"
  >
    handleVideoFrameByCanvas
    <input
      ref="uploadRef"
      type="file"
      class="input-upload"
      @change="uploadChange"
    />
  </div>
</template>

<script lang="ts" setup>
import MP4Box from 'mp4box';
import { onMounted, ref } from 'vue';

import { createVideo } from '@/utils';

const canvasRef = ref<HTMLCanvasElement>();
const uploadRef = ref<HTMLInputElement>();
const wrapRef = ref<HTMLDivElement>();
const total = ref(0);
const videoFrameTotal = ref(0);

function handleVideoFrameByWebcodec() {
  // const mp4url = 'mini-video.mp4';
  // const mp4url = '2024-02-25-10s.mp4';
  const mp4url = 'ddd.mp4';
  const mp4box = MP4Box.createFile();
  console.log(mp4box);
  // 这个是额外的处理方法，不需要关心里面的细节
  const getExtradata = () => {
    // 生成VideoDecoder.configure需要的description信息
    const entry = mp4box.moov.traks[0].mdia.minf.stbl.stsd.entries[0];
    console.log('mp4box', mp4box);
    console.log('entry', entry);
    const box = entry.avcC ?? entry.hvcC ?? entry.vpcC;
    console.log('box', box);
    if (box != null) {
      const stream = new MP4Box.DataStream(
        undefined,
        0,
        MP4Box.DataStream.BIG_ENDIAN
      );
      box.write(stream);
      // slice()方法的作用是移除moov box的header信息
      return new Uint8Array(stream.buffer.slice(8));
    }
  };

  // 视频轨道，解码用
  let videoTrack = null;
  let videoDecoder: VideoDecoder = null;
  // 这个就是最终解码出来的视频画面序列文件
  const videoFrames = [];

  let nbSampleTotal = 0;
  let countSample = 0;

  mp4box.onReady = function (info) {
    // 记住视频轨道信息，onSamples匹配的时候需要
    videoTrack = info.videoTracks[0];

    if (videoTrack != null) {
      mp4box.setExtractionOptions(videoTrack.id, 'video', {
        nbSamples: 100,
      });
    }

    // 视频的宽度和高度
    const videoW = videoTrack.track_width;
    const videoH = videoTrack.track_height;

    const ctx = canvasRef.value!.getContext('2d')!;
    let flag = false;
    // 设置视频解码器
    videoDecoder = new VideoDecoder({
      output: (videoFrame) => {
        createImageBitmap(videoFrame).then((img) => {
          console.log(img, 22);
          if (!flag) {
            flag = true;
            canvasRef.value!.style.width = `${img.width / 3}px`;
            // canvasRef.value!.style.height = `${img.height}px`;
            // console.log(img.width, canvasRef.value!.style);
          }
          // ctx.drawImage(img, 0, 0);
          ctx.drawImage(img, 0, 0, img.width, img.height);
          videoFrames.push({
            img,
            duration: videoFrame.duration,
            timestamp: videoFrame.timestamp,
          });
          videoFrame.close();
        });
      },
      error: (err) => {
        console.error('videoDecoder错误：', err);
      },
    });

    nbSampleTotal = videoTrack.nb_samples;
    console.log(videoTrack, 22);
    videoDecoder.configure({
      codec: videoTrack.codec,
      codedWidth: videoW,
      codedHeight: videoH,
      description: getExtradata(),
    });

    mp4box.start();
  };

  mp4box.onSamples = function (trackId, ref, samples) {
    // samples其实就是采用数据了
    if (videoTrack.id === trackId) {
      mp4box.stop();

      countSample += samples.length;

      Object.keys(samples).forEach((key) => {
        const sample = samples[key];
        const type = sample.is_sync ? 'key' : 'delta';
        const chunk = new EncodedVideoChunk({
          type,
          timestamp: sample.cts,
          duration: sample.duration,
          data: sample.data,
        });
        videoDecoder.decode(chunk);
      });

      if (countSample === nbSampleTotal) {
        videoDecoder.flush();
      }
    }
  };

  // 获取视频的arraybuffer数据
  fetch(mp4url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      // 因为文件较小，所以直接一次性写入
      // 如果文件较大，则需要res.body.getReader()创建reader对象，每次读取一部分数据
      // reader.read().then(({ done, value })
      // @ts-ignore
      buffer.fileStart = 0;
      mp4box.appendBuffer(buffer);
      mp4box.flush();
      console.log('buffer', buffer);
      setTimeout(() => {
        console.log('videoFrames', videoFrames.length, videoFrames);
      }, 1000);
    });
}

function uploadChange() {
  const file = uploadRef.value?.files?.[0];

  if (!file) return;
  console.log(file);
  const url = URL.createObjectURL(file);
  const videoEl = createVideo({
    appendChild: false,
  });
  videoEl.src = url;

  let videoWidth = 0;
  let videoHeight = 0;
  let done = false;
  let duration = 0;
  let currentTime = 0;

  function captureFrame() {
    if (videoEl.readyState >= 2) {
      // 确保视频已足够加载以获取当前帧
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      ctx.drawImage(videoEl, 0, 0, videoWidth, videoHeight);
      wrapRef.value?.appendChild(canvas);
      total.value = total.value + 1;
      if (duration > currentTime) {
        // 移动到下一帧
        currentTime += 1;
        videoEl.currentTime += 1 / 20; // 假设 video.frameRate 是您视频的帧率
      } else {
        done = true;
      }
    }
  }

  videoEl.onloadeddata = () => {
    videoWidth = videoEl.videoWidth;
    videoHeight = videoEl.videoHeight;
    duration = videoEl.duration;
    currentTime = videoEl.currentTime;
    videoFrameTotal.value = duration;
    captureFrame();
  };

  videoEl.onseeked = () => {
    if (currentTime < duration && !done) {
      captureFrame();
    } else {
      // 视频结束
      console.log('视频结束');
    }
  };
}

function handleVideoFrameByCanvas() {
  uploadRef.value?.click();
}

onMounted(() => {});
</script>

<style lang="scss" scoped>
.input-upload {
  width: 0;
  height: 0;
  opacity: 0;
}
.frane-list {
  // display: flex;
  // align-items: center;
  // overflow: scroll;
}
</style>
