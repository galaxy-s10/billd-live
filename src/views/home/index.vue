<template>
  <div class="home-wrap">
    <div class="left">
      <video src=""></video>
      <div
        class="btn"
        @click="joinRoom()"
      >
        进入直播
      </div>
    </div>
    <div class="right">
      <div class="list">
        <div
          v-for="(item, index) in liveRoomList"
          :key="index"
          :class="{ item: 1, active: item.roomId === currentRoom.roomId }"
          :style="{ backgroundImage: `url(${item.img})` }"
          @click="currentRoom = item"
        >
          <div class="txt">{{ item.txt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const liveRoomList = ref([
  {
    roomId: '123456',
    txt: '视频聊天',
    // eslint-disable-next-line
    img: require('@/assets/img/CoCo.webp'),
  },
  {
    roomId: '2323',
    txt: '游戏赛事',
    // eslint-disable-next-line
    img: require('@/assets/img/Hololo.webp'),
  },
  {
    roomId: '4454',
    txt: '户外直播',
    // eslint-disable-next-line
    img: require('@/assets/img/MoonTIT.webp'),
  },
  {
    roomId: '43232',
    txt: '鬼畜',
    // eslint-disable-next-line
    img: require('@/assets/img/Nill.webp'),
  },
  {
    roomId: '4647457',
    txt: '闲聊',
    // eslint-disable-next-line
    img: require('@/assets/img/Ojin.webp'),
  },
]);

const currentRoom = ref(liveRoomList.value[0]);

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
