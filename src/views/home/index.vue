<template>
  <div class="home-wrap">
    <div class="play-container">
      <div class="bg"></div>
      <div class="slider-wrap">
        <Slider
          v-if="interactionList.length"
          :list="interactionList"
          :row="2"
          :speed="60"
        ></Slider>
      </div>
      <div class="container">
        <div
          class="left"
          @click="showJoinBtn = !showJoinBtn"
        >
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
          <div v-loading="videoLoading">
            <div
              v-if="currentLiveRoom?.live_room?.flv_url"
              ref="remoteVideoRef"
            ></div>
          </div>
          <template v-if="currentLiveRoom">
            <VideoControls></VideoControls>
            <div
              class="join-btn"
              :class="{
                show: showJoinBtn,
              }"
            >
              <div
                class="btn"
                @click="joinRoom({ roomId: currentLiveRoom.live_room?.id! })"
              >
                进入直播
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
              <div class="hidden">
                <div
                  class="cdn-ico"
                  v-if="item?.live_room?.cdn === 1"
                >
                  <div class="txt">CDN</div>
                </div>
              </div>
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
    </div>
    <div class="area-container">
      <div class="area-item">
        <div class="title">推荐直播</div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in otherLiveRoomList"
            :key="indey"
            class="live-room"
            @click="
              joinRoom({
                roomId: iten.live_room?.id!,
              })
            "
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
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { sliderList } from '@/constant';
import { usePull } from '@/hooks/use-pull';
import { ILive } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';

const router = useRouter();
const appStore = useAppStore();
const canvasRef = ref<Element>();
const showJoinBtn = ref(false);
const topNums = ref(6);
const topLiveRoomList = ref<ILive[]>([]);
const otherLiveRoomList = ref<ILive[]>([]);
const currentLiveRoom = ref<ILive>();
const interactionList = ref(sliderList);
const remoteVideoRef = ref<HTMLDivElement>();

const { videoLoading, remoteVideo, handleStopDrawing, roomLiving, handlePlay } =
  usePull();

watch(
  () => remoteVideo.value,
  (newVal) => {
    newVal.forEach((item) => {
      remoteVideoRef.value?.appendChild(item);
    });
  },
  {
    deep: true,
  }
);

function changeLiveRoom(item: ILive) {
  handleStopDrawing();
  if (item.id === currentLiveRoom.value?.id) return;
  currentLiveRoom.value = item;
  canvasRef.value?.childNodes?.forEach((item) => {
    item.remove();
  });
  appStore.setLiveRoomInfo(item.live_room!);
  roomLiving.value = true;
  handlePlay(item.live_room!);
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      topLiveRoomList.value = res.data.rows.slice(0, topNums.value);
      otherLiveRoomList.value = res.data.rows.slice(topNums.value);
      if (res.data.total) {
        currentLiveRoom.value = topLiveRoomList.value[0];
        appStore.setLiveRoomInfo(currentLiveRoom.value.live_room!);
        roomLiving.value = true;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getLiveRoomList();
});

function joinRoom(data: { roomId: number }) {
  router.push({
    name: routerName.pull,
    params: { roomId: data.roomId },
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  .play-container {
    position: relative;
    z-index: 1;
    padding-bottom: 20px;
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: papayawhip;
      background-position: center;
      background-repeat: no-repeat;
    }
    .slider-wrap {
      padding: 2px 0 4px 0;
    }
    .container {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      margin: 0 auto;
      height: calc($w-1100 / $video-ratio);

      .left {
        position: relative;
        display: inline-block;
        overflow: hidden;
        flex-shrink: 0;
        box-sizing: border-box;
        margin-right: 20px;
        width: $w-1100;
        height: 100%;
        border-radius: 4px;
        background-color: rgba($color: #000000, $alpha: 0.3);

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
            margin-left: 20px;
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

        &:hover {
          .join-btn {
            display: inline-flex !important;
          }
        }
        .join-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 20;
          display: none;
          align-items: center;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          width: 80%;
          transform: translate(-50%, -50%);
          &.show {
            display: inline-flex !important;
          }

          .btn {
            padding: 14px 26px;
            border: 2px solid rgba($color: $theme-color-gold, $alpha: 0.5);
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.3);
            color: $theme-color-gold;
            font-size: 16px;
            cursor: pointer;
            &:hover {
              background-color: $theme-color-gold;
              color: white;
            }
          }
        }
      }
      .right {
        display: inline-block;
        overflow: scroll;
        flex-shrink: 0;
        box-sizing: border-box;
        padding: 12px 10px;
        height: 100%;
        border-radius: 4px;
        background-color: rgba($color: #000000, $alpha: 0.3);

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
            .hidden {
              position: relative;
              overflow: hidden;
              width: 200px;
              height: 110px;
              .cdn-ico {
                position: absolute;
                top: -9px;
                right: -9px;
                z-index: 2;
                width: 60px;
                height: 28px;
                background-color: #f87c48;
                color: white;
                transform: rotate(45deg);
                transform-origin: bottom;

                .txt {
                  margin-left: 10px;
                  background-image: initial !important;
                  font-size: 12px;
                  line-height: 0.8;
                }
              }
            }

            .border {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 3;
              border: 2px solid $theme-color-gold;
              border-radius: 4px;
            }
            .triangle {
              position: absolute;
              top: 50%;
              left: 0;
              display: inline-block;
              border: 5px solid transparent;
              border-right-color: $theme-color-gold;
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
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
  .area-container {
    box-sizing: border-box;
    margin: 10px auto;
    width: $w-1350;

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

// 屏幕宽度小于1330的时候
@media screen and (max-width: 1330px) {
  .home-wrap {
    .play-container {
      .container {
        height: calc($w-900 / $video-ratio);

        .left {
          width: $w-900;
        }
        .right {
        }
      }
    }
    .area-container {
      width: $w-1150;
    }
  }
}
</style>
