<template>
  <div class="home-wrap">
    <div class="left">
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
          :class="{ item: 1, active: item.roomId === currentRoom.roomId }"
          :style="{ backgroundImage: `url(${item.roomId})` }"
          @click="currentRoom = item"
        >
          <div class="txt">{{ item.roomName }}</div>
        </div>
      </div>
      <div v-else>没有在线的直播间</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const liveRoomList = ref<{ roomId: string; roomName: string }[]>([
  // {
  //   roomId: '123456',
  //   txt: '视频聊天',
  //   // eslint-disable-next-line
  //   img: require('@/assets/img/CoCo.webp'),
  // },
  // {
  //   roomId: '2323',
  //   txt: '游戏赛事',
  //   // eslint-disable-next-line
  //   img: require('@/assets/img/Hololo.webp'),
  // },
  // {
  //   roomId: '4454',
  //   txt: '户外直播',
  //   // eslint-disable-next-line
  //   img: require('@/assets/img/MoonTIT.webp'),
  // },
  // {
  //   roomId: '43232',
  //   txt: '鬼畜',
  //   // eslint-disable-next-line
  //   img: require('@/assets/img/Nill.webp'),
  // },
  // {
  //   roomId: '4647457',
  //   txt: '闲聊',
  //   // eslint-disable-next-line
  //   img: require('@/assets/img/Ojin.webp'),
  // },
]);

const currentRoom = ref();

async function getLiveRoomList() {
  try {
    const res = await axios.get(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4300/live/list'
        : 'https://live.hsslive.cn/api/live/list'
    );
    console.log(res.data);
    if (res.data.code === 200) {
      liveRoomList.value = res.data.data.rows.map((item) => {
        console.log(
          item,
          JSON.parse(item.data),
          JSON.parse(item.data).data.roomName
        );
        return {
          roomId: item.roomId,
          roomName: JSON.parse(item.data).data.roomName,
        };
      });
      if (res.data.data.rows.length) {
        currentRoom.value = {
          roomId: res.data.data.rows[0].roomId,
          roomName: JSON.parse(res.data.data.rows[0].data).data.roomName,
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
  router.push({ path: `/${currentRoom.value.roomId}` });
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
    width: $large-left-width;
    height: 100%;
    border-radius: 4px;
    background-color: papayawhip;
    vertical-align: top;
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
      border: 1px solid rgba($color: rebeccapurple, $alpha: 0.3);
      border-radius: 4px;
      color: rebeccapurple;
      font-size: 14px;
      cursor: pointer;
      transform: translate(-50%, -50%);
      &:hover {
        background-color: rgba($color: rebeccapurple, $alpha: 0.3);
      }
    }
  }
  .right {
    display: inline-block;
    margin-left: 10px;
    padding: 10px;
    padding-bottom: 0;
    border-radius: 4px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    vertical-align: top;

    .list {
      .item {
        position: relative;
        margin-bottom: 10px;
        width: 200px;
        height: 110px;
        border-radius: 4px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        cursor: pointer;
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
  }
}

// 屏幕宽度小于$large-width的时候
@media screen and (max-width: $large-width) {
  .home-wrap {
    height: 460px;
    .left {
      width: $medium-left-width;
    }
    .right {
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
