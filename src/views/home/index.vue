<template>
  <div class="home-wrap">
    <div class="banner"></div>
    <div class="play-container">
      <div class="left">
        <div
          v-if="currentLiveRoom?.live_room?.cdn === 1"
          class="cdn-ico"
        >
          <div class="txt">CDN</div>
        </div>
        <div
          class="cover"
          :style="{
            backgroundImage: `url(${
              currentLiveRoom?.live_room?.cover_img ||
              currentLiveRoom?.user?.avatar
            })`,
          }"
        ></div>
        <div
          v-if="currentLiveRoom?.live_room?.flv_url"
          ref="canvasRef"
        ></div>
        <template v-if="currentLiveRoom">
          <VideoControls></VideoControls>
          <div
            class="join-btn"
            :style="{
              display: !isMobile() ? 'none' : showControls ? 'block' : 'none',
            }"
          >
            <div
              v-if="
                currentLiveRoom.live_room?.type ===
                  LiveRoomTypeEnum.user_wertc ||
                currentLiveRoom.live_room?.type === LiveRoomTypeEnum.user_srs
              "
              class="btn webrtc"
              @click="joinRoom()"
            >
              进入直播（webrtc）
            </div>
            <div
              v-if="
                currentLiveRoom.live_room?.type !== LiveRoomTypeEnum.user_wertc
              "
              class="btn flv"
              @click="joinFlvRoom()"
            >
              进入直播（flv）
            </div>
            <div
              v-if="
                currentLiveRoom.live_room?.type !== LiveRoomTypeEnum.user_wertc
              "
              class="btn hls"
              @click="joinHlsRoom()"
            >
              进入直播（hls）
            </div>
          </div>
        </template>
      </div>
      <div class="right">
        <div
          v-if="topLiveRoomList.length"
          class="list"
        >
          <div
            v-for="(item, index) in topLiveRoomList"
            :key="index"
            :class="{
              item: 1,
              active: item.live_room_id === currentLiveRoom?.live_room_id,
            }"
            :style="{
              backgroundImage: `url(${
                item.live_room?.cover_img || item?.user?.avatar
              })`,
            }"
            @click="changeLiveRoom(item)"
          >
            <div
              class="border"
              :style="{
                opacity:
                  item.live_room_id === currentLiveRoom?.live_room_id ? 1 : 0,
              }"
            ></div>
            <div
              v-if="item.live_room_id === currentLiveRoom?.live_room_id"
              class="triangle"
            ></div>
            <div class="txt">{{ item.live_room?.name }}</div>
          </div>
        </div>
        <div
          v-else
          class="none"
        >
          当前没有在线的直播间
        </div>
      </div>
    </div>
    <div class="area-container">
      <div class="area-item">
        <div class="title">推荐直播</div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in otherLiveRoomList"
            :key="indey"
            class="live-room"
            @click="goRoom(iten.live_room!)"
          >
            <div
              class="cover"
              :style="{
                backgroundImage: `url('${
                  iten?.live_room?.cover_img || iten?.user?.avatar
                }')`,
              }"
            >
              <div
                v-if="iten?.live_room?.cdn === 1"
                class="cdn-ico"
              >
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ iten?.user?.username }}</div>
            </div>
            <div class="desc">{{ iten?.live_room?.name }}</div>
          </div>
          <div
            v-if="!otherLiveRoomList.length"
            class="null"
          >
            暂无数据
          </div>
        </div>
      </div>
    </div>

    <div class="foot">*部分内容来源网络，如有侵权，请联系我删除~</div>
  </div>
</template>

<script lang="ts" setup>
import { isMobile, judgeDevice } from 'billd-utils';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { flvJs, useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { ILive, ILiveRoom, LiveRoomTypeEnum, liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { videoToCanvas } from '@/utils';

const canvasRef = ref<Element>();
const router = useRouter();
const showControls = ref(false);
const topLiveRoomList = ref<ILive[]>([]);
const otherLiveRoomList = ref<ILive[]>([]);
const currentLiveRoom = ref<ILive>();

const { flvVideoEl, startFlvPlay, destroyFlv } = useFlvPlay();
const { startHlsPlay, destroyHls } = useHlsPlay();

async function changeLiveRoom(item: ILive) {
  if (item.id === currentLiveRoom.value?.id) return;
  currentLiveRoom.value = item;
  canvasRef.value?.childNodes?.forEach((item) => {
    item.remove();
  });
  if (
    item.live_room?.type === LiveRoomTypeEnum.user_srs ||
    item.live_room?.type === LiveRoomTypeEnum.user_obs ||
    item.live_room?.type === LiveRoomTypeEnum.system
  ) {
    // @ts-ignore
    if (flvJs.isSupported()) {
      const { width, height } = await startFlvPlay({
        flvurl: item.live_room.flv_url!,
      });
      videoToCanvas({
        videoEl: flvVideoEl.value!,
        targetEl: canvasRef.value!,
        width,
        height,
      });
    } else {
      destroyHls();
      await startHlsPlay({
        hlsurl: item.live_room.hls_url!,
      });
    }
  } else {
    destroyFlv();
  }
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      const top = 6;
      topLiveRoomList.value = res.data.rows.slice(0, top);
      otherLiveRoomList.value = res.data.rows.slice(top);
      if (res.data.total) {
        currentLiveRoom.value = topLiveRoomList.value[0];
        nextTick(async () => {
          if (
            currentLiveRoom.value?.live_room?.type ===
              LiveRoomTypeEnum.user_srs ||
            currentLiveRoom.value?.live_room?.type ===
              LiveRoomTypeEnum.user_obs ||
            currentLiveRoom.value?.live_room?.type === LiveRoomTypeEnum.system
          ) {
            if (judgeDevice().isIphone) {
              await startHlsPlay({
                hlsurl: currentLiveRoom.value.live_room.hls_url!,
              });
            } else {
              const { width, height } = await startFlvPlay({
                flvurl: currentLiveRoom.value.live_room.flv_url!,
              });
              videoToCanvas({
                videoEl: flvVideoEl.value!,
                targetEl: canvasRef.value!,
                width,
                height,
              });
            }
          } else {
            destroyFlv();
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getLiveRoomList();
});

function joinRoom() {
  if (currentLiveRoom.value?.live_room?.type === LiveRoomTypeEnum.user_srs) {
    router.push({
      name: routerName.pull,
      params: {
        roomId: currentLiveRoom.value.live_room_id,
      },
      query: {
        liveType: liveTypeEnum.srsWebrtcPull,
      },
    });
  } else {
    router.push({
      name: routerName.pull,
      params: {
        roomId: currentLiveRoom.value?.live_room_id,
      },
      query: {
        liveType: liveTypeEnum.webrtcPull,
      },
    });
  }
}

function goRoom(item: ILiveRoom) {
  router.push({
    name: routerName.pull,
    params: { roomId: item.id },
    query: {
      liveType: liveTypeEnum.srsFlvPull,
    },
  });
}

function joinFlvRoom() {
  router.push({
    name: routerName.pull,
    params: { roomId: currentLiveRoom.value?.live_room_id },
    query: {
      liveType: liveTypeEnum.srsFlvPull,
    },
  });
}

function joinHlsRoom() {
  router.push({
    name: routerName.pull,
    params: { roomId: currentLiveRoom.value?.live_room_id },
    query: {
      liveType: liveTypeEnum.srsHlsPull,
    },
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  .play-container {
    padding: 20px 0;
    // min-width: $large-width;
    background-color: papayawhip;
    text-align: center;
    white-space: nowrap;
    &.area {
      text-align: initial;
    }
    .left {
      position: relative;
      display: inline-block;
      overflow: hidden;
      box-sizing: border-box;
      width: $large-left-width;
      height: 610px;
      border-radius: 4px;
      background-color: rgba($color: #000000, $alpha: 0.3);
      vertical-align: top;

      @extend %coverBg;

      .cdn-ico {
        position: absolute;
        top: -9px;
        right: -10px;
        z-index: 2;
        width: 70px;
        height: 32px;
        background-color: #f87c48;
        color: white;
        transform: rotate(45deg);
        transform-origin: bottom;
        .txt {
          margin-top: 11px;
          margin-left: 2px;
          background-image: initial !important;
          font-size: 14px;
        }
      }

      .cover {
        position: absolute;
        background-position: center center;
        background-size: cover;
        filter: blur(10px);

        inset: 0;
      }
      :deep(canvas) {
        position: absolute;
        top: 0;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%);

        user-select: none;
      }
      :deep(video) {
        position: absolute;
        top: 0;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%);

        user-select: none;
      }
      .controls {
        display: none;
      }

      &:hover {
        .join-btn {
          display: inline-flex !important;
        }
      }
      .join-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        display: none;
        align-items: center;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 80%;
        transform: translate(-50%, -50%);

        .btn {
          padding: 14px 26px;
          border: 2px solid rgba($color: papayawhip, $alpha: 0.5);
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.3);
          color: papayawhip;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            background-color: rgba($color: papayawhip, $alpha: 0.5);
            color: white;
          }
          &.webrtc {
            margin-right: 10px;
          }
          &.flv {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      display: inline-block;
      overflow: scroll;
      box-sizing: border-box;
      margin-left: 10px;
      padding: 12px;
      height: 610px;
      border-radius: 4px;
      background-color: rgba($color: #000000, $alpha: 0.3);
      vertical-align: top;

      @extend %hideScrollbar;

      .list {
        .item {
          position: relative;
          box-sizing: border-box;
          margin-bottom: 10px;
          width: 200px;
          height: 110px;
          border-radius: 4px;
          background-color: rgba($color: #000000, $alpha: 0.3);
          cursor: pointer;

          @extend %coverBg;

          &:last-child {
            margin-bottom: 0;
          }
          .border {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            border: 2px solid papayawhip;
            border-radius: 4px;
          }
          .triangle {
            position: absolute;
            top: 50%;
            left: 0;
            display: inline-block;
            border: 5px solid transparent;
            border-right-color: papayawhip;
            transform: translate(-100%, -50%);
          }
          &.active {
            &::before {
              background-color: transparent;
            }
          }
          &:hover {
            &::before {
              background-color: transparent;
            }
          }
          &::before {
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.4);
            content: '';
            transition: all cubic-bezier(0.22, 0.58, 0.12, 0.98) 0.4s;
          }
          .txt {
            position: absolute;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            padding: 4px 8px;
            width: 100%;
            border-radius: 0 0 4px 4px;
            background-image: linear-gradient(
              -180deg,
              rgba(0, 0, 0, 0),
              rgba(0, 0, 0, 0.6)
            );
            color: white;
            text-align: initial;
            font-size: 13px;

            @extend %singleEllipsis;
          }
        }
      }
      .none {
        width: 200px;
        color: white;
        font-size: 14px;
      }
    }
  }
  .area-container {
    margin: 10px auto;
    width: 1336px;
    .area-item {
      .title {
        padding: 10px 0;
        font-size: 26px;
      }
      .live-room {
        display: inline-block;
        margin-right: 32px;
        margin-bottom: 10px;
        width: 300px;
        cursor: pointer;

        .cover {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 150px;
          border-radius: 8px;
          background-position: center center;
          background-size: cover;
          .cdn-ico {
            position: absolute;
            top: -10px;
            right: -10px;
            z-index: 2;
            width: 70px;
            height: 28px;
            background-color: #f87c48;
            color: white;
            transform: rotate(45deg);
            transform-origin: bottom;
            .txt {
              margin-left: 18px;
              background-image: initial !important;
              font-size: 13px;
            }
          }

          .txt {
            position: absolute;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            padding: 4px 8px;
            width: 100%;
            border-radius: 0 0 4px 4px;
            background-image: linear-gradient(
              -180deg,
              rgba(0, 0, 0, 0),
              rgba(0, 0, 0, 0.6)
            );
            color: white;
            text-align: initial;
            font-size: 13px;

            @extend %singleEllipsis;
          }
        }
        .desc {
          margin-top: 4px;
          font-size: 14px;

          @extend %singleEllipsis;
        }
      }
    }
  }
  .foot {
    margin-top: 10px;
    text-align: center;
  }
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .home-wrap {
    .play-container {
      .left {
        width: $medium-left-width;
        height: 460px;
      }
      .right {
        height: 460px;

        .list {
          .item {
            width: 150px;
            height: 80px;
          }
        }
      }
    }
    .area-container {
      width: 1085px;
    }
  }
}
</style>
