<template>
  <div class="home-wrap">
    <div class="play-container">
      <div class="bg"></div>
      <div class="container">
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
          <div v-loading="videoLoading">
            <div
              v-if="currentLiveRoom?.live_room?.flv_url"
              ref="canvasRef"
            ></div>
          </div>
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
                  LiveRoomTypeEnum.user_wertc
                "
                class="btn webrtc"
                @click="joinRtcRoom()"
              >
                进入直播（webrtc）
              </div>
              <div
                v-if="
                  currentLiveRoom.live_room?.type === LiveRoomTypeEnum.user_srs
                "
                class="btn webrtc"
                @click="joinRtcRoom()"
              >
                进入直播（srs-webrtc）
              </div>
              <div
                v-if="
                  currentLiveRoom.live_room?.type !==
                  LiveRoomTypeEnum.user_wertc
                "
                class="btn flv"
                @click="
                  joinRoom({
                    isFlv: true,
                    roomId: currentLiveRoom.live_room_id!,
                  })
                "
              >
                进入直播（flv）
              </div>
              <div
                v-if="
                  currentLiveRoom.live_room?.type !==
                  LiveRoomTypeEnum.user_wertc
                "
                class="btn hls"
                @click="
                  joinRoom({
                    isFlv: false,
                    roomId: currentLiveRoom.live_room_id!,
                  })
                "
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
                isFlv: false,
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
import { isMobile } from 'billd-utils';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { usePull } from '@/hooks/use-pull';
import { ILive, LiveRoomTypeEnum, liveTypeEnum } from '@/interface';
import { routerName } from '@/router';

const route = useRoute();
const router = useRouter();
const canvasRef = ref<Element>();
const showControls = ref(false);
const topNums = ref(6);
const topLiveRoomList = ref<ILive[]>([]);
const otherLiveRoomList = ref<ILive[]>([]);
const currentLiveRoom = ref<ILive>();
const localVideoRef = ref<HTMLVideoElement[]>([]);

const { handleHlsPlay, videoLoading } = usePull({
  localVideoRef,
  canvasRef,
  liveType: route.query.liveType as liveTypeEnum,
  isSRS: [
    liveTypeEnum.srsWebrtcPull,
    liveTypeEnum.srsFlvPull,
    liveTypeEnum.srsHlsPull,
  ].includes(route.query.liveType as liveTypeEnum),
});

function changeLiveRoom(item: ILive) {
  if (item.id === currentLiveRoom.value?.id) return;
  currentLiveRoom.value = item;
  canvasRef.value?.childNodes?.forEach((item) => {
    item.remove();
  });
  if (
    [
      LiveRoomTypeEnum.user_srs,
      LiveRoomTypeEnum.user_obs,
      LiveRoomTypeEnum.system,
    ].includes(item.live_room?.type!)
  ) {
    handleHlsPlay(item.live_room?.hls_url!);
  }
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
        if (
          [
            LiveRoomTypeEnum.user_srs,
            LiveRoomTypeEnum.user_obs,
            LiveRoomTypeEnum.system,
          ].includes(currentLiveRoom.value?.live_room?.type!)
        ) {
          handleHlsPlay(currentLiveRoom.value.live_room?.hls_url!);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getLiveRoomList();
});

function joinRtcRoom() {
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

function joinRoom(data: { roomId: number; isFlv: boolean }) {
  router.push({
    name: routerName.pull,
    params: { roomId: data.roomId },
    query: {
      liveType: data.isFlv ? liveTypeEnum.srsFlvPull : liveTypeEnum.srsHlsPull,
    },
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  .play-container {
    position: relative;
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
    .container {
      display: flex;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 15px 0;
      justify-content: center;
      height: calc($w-1100 / $video-ratio);

      .left {
        position: relative;
        display: inline-block;
        overflow: hidden;
        box-sizing: border-box;
        flex-shrink: 0;
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
        flex-shrink: 0;
        display: inline-block;
        overflow: scroll;
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
            .border {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 1;
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
    margin: 10px auto;
    width: $w-1350;
    box-sizing: border-box;

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
