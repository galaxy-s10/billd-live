<template>
  <div class="slider-wrap">
    <div
      v-for="(slider, index) in sliderList"
      :key="'slider-' + index"
      class="slider"
      :style="{
        '--width': widthMap[index] / 2,
        '--speed': widthMap[index] / 2 / speed + 's',
        width: widthMap[index] / 2 + 'px',
        // background: 'red',
        margin: '0 auto',
      }"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <div
          v-for="(slide, indey) in slider"
          :key="'slide-' + indey"
          class="slide"
          :data-txt="slide.txt"
        >
          <div class="avatar">
            <div
              alt=""
              class="img"
              :style="{ backgroundImage: `url(${slide.img})` }"
            ></div>
          </div>

          <span class="txt">
            <span class="msg">{{ slide.txt }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    require: true,
    default() {
      return [];
    },
  },
  // 多少行
  row: {
    type: Number,
    default: 3,
  },
  // 滚动速率 (px/s)
  speed: {
    type: Number,
    default: 100,
  },
});

const containerRef = ref<HTMLDivElement[]>([]);
const sliderList = ref<any[]>([]);
const widthMap = ref<Record<number, number>>({});
const min = ref(0);

onMounted(() => {
  const res: any[] = [];
  const count = Math.ceil(props.list.length / props.row);
  for (let i = 0, len = props.list.length; i < len; i += count) {
    const item = props.list.slice(i, i + count);
    res.push([...item, ...item]);
  }
  sliderList.value = res;
  nextTick(() => {
    const res = {};
    containerRef.value.forEach((container, index) => {
      for (let i = 0; i < container.children.length; i += 1) {
        const slideList = container.children;
        for (let y = 0; y < slideList.length; y += 1) {
          const slide = slideList[y];
          if (index === i) {
            res[index] = res[index] || 0;
            res[index] += slide.getBoundingClientRect().width;
          }
        }
      }
    });

    Object.keys(res).forEach((item) => {
      if (min.value === 0) {
        min.value = res[item];
      }
      if (res[item] < min.value) {
        min.value = res[item];
      }
    });
    widthMap.value = res;
  });
});
</script>

<style lang="scss" scoped>
@keyframes left-right {
  0% {
    transform: translateX(calc(var(--width) * -1px));
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes right-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(var(--width) * -1px));
  }
}
.slider-wrap {
  .slider {
    overflow-x: scroll;

    @extend %hideScrollbar;

    &:nth-child(2n) {
      .container {
        animation: left-right var(--speed) linear infinite;
        &:hover {
          animation-play-state: paused;
        }
      }
    }
    &:nth-child(2n-1) {
      .container {
        animation: right-left var(--speed) linear infinite;
        &:hover {
          animation-play-state: paused;
        }
      }
    }

    .container {
      display: inline-flex;

      .slide {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        box-sizing: border-box;
        padding-right: 30px;
        height: 40px;
        .avatar {
          display: flex;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #fff;

          .img {
            width: 25px;
            height: 25px;

            @extend %containBg;
          }
        }
        .txt {
          max-width: 130px;
          font-size: 14px;

          @extend %singleEllipsis;
        }
      }
    }
  }
}
</style>
