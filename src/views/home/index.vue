<template>
  <div class="home-wrap">
    <div class="banner"></div>
    <div class="container">
      <div class="left">
        <div
          class="cover"
          :style="{
            backgroundImage: `url(${currentLiveRoom?.live_room?.cover_img})`,
          }"
        ></div>
        <!-- x-webkit-airplay这个属性应该是使此视频支持ios的AirPlay功能 -->
        <!-- playsinline、 webkit-playsinline IOS微信浏览器支持小窗内播放 -->
        <!-- x5-video-player-type 启用H5播放器，是wechat安卓版特性 -->
        <!-- x5-video-player-fullscreen 全屏设置 -->
        <!-- x5-video-orientation 声明播放器支持的方向，可选值landscape横屏，portraint竖屏。默认值portraint。 -->
        <video
          v-if="currentLiveRoom?.live_room?.flv_url"
          id="localVideo"
          ref="localVideoRef"
          autoplay
          playsinline
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          x5-video-orientation="portraint"
          :muted="appStore.muted"
          @click="showControls = !showControls"
        ></video>
        <template v-if="currentLiveRoom">
          <div
            class="controls"
            :style="{
              display: !isMobile() ? 'none' : showControls ? 'block' : 'none',
            }"
          >
            <VideoControls></VideoControls>
          </div>
          <div
            class="join-btn"
            :style="{
              display: !isMobile() ? 'none' : showControls ? 'block' : 'none',
            }"
          >
            <div
              v-if="
                currentLiveRoom.live_room?.type !== LiveRoomTypeEnum.user_obs
              "
              class="btn webrtc"
              @click="joinRoom()"
            >
              进入直播（webrtc）
            </div>
            <div
              v-if="
                currentLiveRoom?.live_room?.type === LiveRoomTypeEnum.user_srs
              "
              class="btn flv"
              @click="joinFlvRoom()"
            >
              进入直播（flv）
            </div>
          </div>
        </template>
      </div>
      <div class="right">
        <div
          v-if="liveRoomList.length"
          class="list"
        >
          <div
            v-for="(item, index) in liveRoomList"
            :key="index"
            :class="{
              item: 1,
              active: item.live_room_id === currentLiveRoom?.live_room_id,
            }"
            :style="{ backgroundImage: `url(${item.live_room?.cover_img})` }"
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

    <div class="foot">*部分内容来源网络，如有侵权，请联系我删除~</div>
  </div>
</template>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { useFlvPlay } from '@/hooks/use-play';
import { ILive, LiveRoomTypeEnum, liveTypeEnum } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const router = useRouter();
const showControls = ref(false);
const liveRoomList = ref<ILive[]>([]);
const currentLiveRoom = ref<ILive>();
const localVideoRef = ref<HTMLVideoElement>();

const { startPlay } = useFlvPlay();

function changeLiveRoom(item: ILive) {
  currentLiveRoom.value = item;
  nextTick(async () => {
    if (
      item.live_room?.type === LiveRoomTypeEnum.user_srs ||
      item.live_room?.type === LiveRoomTypeEnum.user_obs ||
      item.live_room?.type === LiveRoomTypeEnum.system
    ) {
      await startPlay({
        flvurl: item.live_room.flv_url!,
        videoEl: localVideoRef.value!,
      });
    }
  });
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      liveRoomList.value = res.data.rows;
      if (res.data.total) {
        currentLiveRoom.value = res.data.rows[0];
        nextTick(async () => {
          if (
            currentLiveRoom.value?.live_room?.type ===
              LiveRoomTypeEnum.user_srs ||
            currentLiveRoom.value?.live_room?.type ===
              LiveRoomTypeEnum.user_obs ||
            currentLiveRoom.value?.live_room?.type === LiveRoomTypeEnum.system
          ) {
            await startPlay({
              flvurl: currentLiveRoom.value.live_room.flv_url!,
              videoEl: localVideoRef.value!,
            });
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

function joinFlvRoom() {
  // console.log(currentLiveRoom.value?.live_room_id);
  // return;
  router.push({
    name: routerName.pull,
    params: { roomId: currentLiveRoom.value?.live_room_id },
    query: {
      liveType: liveTypeEnum.srsFlvPull,
    },
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  .container {
    padding: 20px 0;
    min-width: $large-width;
    background-color: papayawhip;
    text-align: center;
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

      .cover {
        position: absolute;
        background-position: center center;
        background-size: cover;
        filter: blur(30px);

        inset: 0;
      }

      #localVideo {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .controls {
        display: none;
      }

      &:hover {
        .join-btn {
          display: inline-flex !important;
        }
        .controls {
          display: block !important;
        }
      }
      .join-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        display: none;
        align-items: center;
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
  .foot {
    margin-top: 10px;
    text-align: center;
  }
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .home-wrap {
    .container {
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
  }
}
</style>
