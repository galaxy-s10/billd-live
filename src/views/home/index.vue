<template>
  <div class="home-wrap">
    <div
      class="left"
      :style="{ backgroundImage: `url(${currentLiveRoom?.coverImg})` }"
    >
      <video
        v-if="currentLiveRoom?.flvurl"
        id="localVideo"
        ref="localVideoRef"
        autoplay
        webkit-playsinline="true"
        playsinline
        x-webkit-airplay="allow"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portraint"
        muted
        controls
      ></video>
      <div
        v-if="currentLiveRoom"
        class="btn-wrap"
      >
        <div
          v-if="currentLiveRoom.system === 2"
          class="btn webrtc"
          @click="joinRoom()"
        >
          进入直播（webrtc）
        </div>
        <div
          v-if="currentLiveRoom?.flvurl"
          class="btn flv"
          @click="joinFlvRoom()"
        >
          进入直播（flv）
        </div>
      </div>
    </div>
    <div class="right">
      <div
        v-if="liveRoomList.length"
        class="list"
      >
        <div
          v-for="(item, index) in liveRoomList"
          :key="index"
          :class="{ item: 1, active: item.roomId === currentLiveRoom?.roomId }"
          :style="{ backgroundImage: `url(${item.coverImg})` }"
          @click="currentLiveRoom = item"
        >
          <div
            class="border"
            :style="{
              opacity: item.roomId === currentLiveRoom?.roomId ? 1 : 0,
            }"
          ></div>
          <div
            v-if="item.roomId === currentLiveRoom?.roomId"
            class="triangle"
          ></div>
          <div class="txt">{{ item.roomName }}</div>
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
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { useFlvPlay } from '@/hooks/use-play';
import { ILive } from '@/interface';
import { routerName } from '@/router';

const router = useRouter();
const liveRoomList = ref<ILive[]>([]);
const currentLiveRoom = ref<ILive>();
const localVideoRef = ref<HTMLVideoElement>();

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
        nextTick(() => {
          if (currentLiveRoom.value?.flvurl) {
            useFlvPlay(currentLiveRoom.value.flvurl, localVideoRef.value!);
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
  if (currentLiveRoom.value?.streamurl) {
    router.push({
      name: routerName.srsWebRtcPull,
      params: { roomId: currentLiveRoom.value.roomId },
    });
  } else {
    router.push({
      name: routerName.webrtcPull,
      params: { roomId: currentLiveRoom.value?.roomId },
    });
  }
}

function joinFlvRoom() {
  router.push({
    name: routerName.srsFlvPull,
    params: { roomId: currentLiveRoom.value?.roomId },
  });
}
</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 20px 0;
  min-width: $large-width;
  height: 610px;
  background-color: skyblue;
  text-align: center;

  .left {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: $large-left-width;
    height: 610px;
    border-radius: 4px;
    background-color: papayawhip;
    vertical-align: top;

    #localVideo {
      width: 100%;
      height: 100%;
    }

    @extend %coverBg;

    &:hover {
      .btn-wrap {
        display: inline-flex;
      }
    }
    .btn-wrap {
      position: absolute;
      top: 50%;
      left: 50%;
      display: none;
      align-items: center;
      transform: translate(-50%, -50%);

      .btn {
        cursor: pointer;

        padding: 14px 26px;
        border: 2px solid rgba($color: skyblue, $alpha: 0.5);
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.3);
        color: skyblue;
        font-size: 16px;
        &:hover {
          background-color: rgba($color: skyblue, $alpha: 0.5);
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
          border: 2px solid skyblue;
          border-radius: 4px;
        }
        .triangle {
          position: absolute;
          top: 50%;
          left: 0;
          display: inline-block;
          border: 5px solid transparent;
          border-right-color: skyblue;
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
        }
      }
    }
    .none {
      color: white;
      font-size: 14px;
    }
  }
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .home-wrap {
    height: 460px;
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
</style>
