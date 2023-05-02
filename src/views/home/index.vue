<template>
  <div class="home-wrap">
    <div
      class="left"
      :style="{ backgroundImage: `url(${currentLiveRoom?.coverImg})` }"
    >
      <video src=""></video>
      <div
        v-if="liveRoomList.length"
        class="btn"
        @click="joinRoom()"
      >
        进入直播
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchLiveList } from '@/api/live';
import { routerName } from '@/router';

interface IRoom {
  roomId: string;
  roomName: string;
  srs?: { streamurl: string };
  coverImg: string;
}

const router = useRouter();
const liveRoomList = ref<IRoom[]>([]);
const currentLiveRoom = ref<IRoom>();

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList();
    if (res.code === 200) {
      liveRoomList.value = res.data.rows.map((item) => {
        return {
          roomId: item.roomId,
          roomName: JSON.parse(item.data).data.roomName,
          coverImg: JSON.parse(item.data).data.coverImg,
          srs: JSON.parse(item.data).data.srs,
        };
      });
      if (res.data.count) {
        const item = res.data.rows[0].data;
        currentLiveRoom.value = {
          roomId: res.data.rows[0].roomId,
          roomName: JSON.parse(item).data.roomName,
          coverImg: JSON.parse(item).data.coverImg,
          srs: JSON.parse(item).data.srs,
        };
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
  if (currentLiveRoom.value?.srs) {
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

    @extend %coverBg;

    &:hover {
      .btn {
        display: inline-block;
      }
    }
    .btn {
      position: absolute;
      top: 50%;
      left: 50%;
      display: none;
      padding: 10px 20px;
      border: 1px solid rgba($color: skyblue, $alpha: 0.3);
      border-radius: 4px;
      color: skyblue;
      font-size: 14px;
      cursor: pointer;
      transform: translate(-50%, -50%);
      &:hover {
        background-color: rgba($color: skyblue, $alpha: 0.3);
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
          border: 2px solid skyblue;
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
          bottom: 2px;
          left: 4px;
          color: white;
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
