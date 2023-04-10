<template>
  <div class="home-wrap">
    <div class="left">
      <div class="head">
        <div class="info">
          <div class="avatar"></div>
          <div class="detail">
            <div class="top">
              <span class="tag">未开播</span>
              房东的猫livehouse/音乐节
            </div>
            <div class="bottom">
              <span class="tag">UP 3</span>
              up名字
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <span class="item">
              <i class="ico"></i>
              <span>直播间管理</span>
            </span>
            <span class="item">
              <i class="ico"></i>
              <span>1人看过</span>
            </span>
            <span class="item">
              <i class="ico"></i>
              <span>分享</span>
            </span>
          </div>
          <div class="bottom">关注量：5</div>
        </div>
      </div>
      <div class="video"></div>
      <div class="gift">
        <div
          v-for="(item, index) in giftList"
          :key="index"
          class="item"
        >
          <div class="ico"></div>
          <div class="name">{{ item.name }}</div>
          <div class="price">{{ item.price }}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="tab">
        <span>在线用户</span>
        <span> | </span>
        <span>大航海</span>
      </div>
      <div class="user-list">
        <div
          v-for="(item, index) in userList"
          :key="index"
          class="item"
        >
          <div class="info">
            <div class="avatar"></div>
            <div class="nickname">{{ item.nickname }}</div>
          </div>
          <div class="expr">{{ item.expr }}</div>
        </div>
      </div>
      <div class="msg-list">
        <div
          v-for="(item, index) in msgList"
          :key="index"
          class="item"
        >
          <span class="name">{{ item.nickname }}：</span>
          <span class="msg">{{ item.msg }}</span>
        </div>
      </div>
      <div class="send-msg">
        <textarea class="ipt"></textarea>
        <div class="btn">发送</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const giftList = ref([
  { name: '鲜花', ico: '', price: '免费' },
  { name: '肥宅水', ico: '', price: '2元' },
  { name: '小鸡腿', ico: '', price: '3元' },
  { name: '大鸡腿', ico: '', price: '5元' },
  { name: '一杯咖啡', ico: '', price: '10元' },
]);
const msgList = ref([
  { nickname: '鲜花', msg: '423425' },
  { nickname: '肥宅水', msg: 'sdgdsgsg' },
  { nickname: '小鸡腿', msg: '63463gsd' },
  { nickname: '大鸡腿', msg: '46326fb26' },
  { nickname: '一杯咖啡', msg: 'shgd544' },
  { nickname: 'sdsg', msg: 'shgd544' },
  { nickname: 'gdsg', msg: 'we' },
  { nickname: 'sgdx', msg: 'shgd544' },
  { nickname: 'gsdx', msg: 'ew' },
  { nickname: 'gs', msg: 'etew' },
  { nickname: 'gwe', msg: 'shgd544' },
  { nickname: 'tewtwe', msg: 'shgd544' },
  { nickname: 'hdfh', msg: 'ew' },
  { nickname: '534', msg: 'etew' },
  { nickname: '234232', msg: 'shgd544' },
]);

const userList = ref([
  { nickname: '鲜花', avatar: '423425', expr: 100 },
  { nickname: '肥宅水', avatar: 'sdgdsgsg', expr: 100 },
  { nickname: '小鸡腿', avatar: '63463gsd', expr: 100 },
  { nickname: '大鸡腿', avatar: '46326fb26', expr: 100 },
  { nickname: '一杯咖啡', avatar: 'shgd544', expr: 100 },
]);
</script>

<style lang="scss" scoped>
.home-wrap {
  display: flex;
  justify-content: space-between;
  margin: 20px auto 0;
  min-width: 1200px;
  width: 80%;
  .left {
    min-width: 1000px;
    border-radius: 10px;
    background-color: white;
    color: #9499a0;
    .head {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      .tag {
        display: inline-block;
        margin-right: 5px;
        padding: 1px 4px;
        border: 1px solid;
        border-radius: 2px;
        color: #9499a0;
        font-size: 12px;
      }

      .info {
        display: flex;
        align-items: center;
        .avatar {
          margin-right: 20px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: yellow;
        }
        .detail {
          .top {
            margin-bottom: 10px;
            color: #18191c;
          }
          .bottom {
            font-size: 14px;
          }
        }
      }
      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        .top {
          display: flex;
          align-items: center;
          .item {
            display: flex;
            align-items: center;
            margin-right: 20px;
            .ico {
              display: inline-block;
              margin-right: 4px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background-color: skyblue;
            }
          }
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
    .video {
      height: 500px;
      background-color: #18191c;
    }
    .gift {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      background-color: white;
      .item {
        margin-right: 10px;
        text-align: center;

        .ico {
          width: 50px;
          height: 50px;
          background-color: skyblue;
        }
        .name {
          color: #18191c;
          font-size: 12px;
        }
        .price {
          color: #9499a0;
          font-size: 12px;
        }
      }
    }
  }
  .right {
    position: relative;
    box-sizing: border-box;
    min-width: 300px;
    border-radius: 10px;
    background-color: white;
    color: #9499a0;
    .tab {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 5px 0;
      font-size: 12px;
    }
    .user-list {
      overflow-y: scroll;
      padding: 0 15px;
      height: 100px;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 12px;
        .info {
          display: flex;
          align-items: center;

          .avatar {
            margin-right: 5px;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            background-color: skyblue;
          }
          .nickname {
            color: black;
          }
        }
      }
    }
    .msg-list {
      overflow-y: scroll;
      padding: 0 15px;
      height: 350px;
      .item {
        margin-bottom: 10px;
        font-size: 12px;
        .name {
          color: #9499a0;
        }
        .msg {
          color: #61666d;
        }
      }
    }
    .send-msg {
      position: absolute;
      bottom: 15px;
      box-sizing: border-box;
      padding: 0 10px;
      width: 100%;
      .ipt {
        display: block;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 10px;
        width: 100%;
        height: 60px;
        outline: none;
        border: 1px solid hsla(0, 0%, 60%, 0.2);
        border-radius: 4px;
        background-color: #f1f2f3;
        font-size: 14px;
      }
      .btn {
        box-sizing: border-box;
        margin-top: 10px;
        margin-left: auto;
        padding: 5px;
        width: 80px;
        border-radius: 4px;
        background-color: #23ade5;
        color: white;
        text-align: center;
        font-size: 12px;
      }
    }
  }
}
</style>
