<template>
  <div class="liveroom-item">
    <div
      v-lazy:background-image="liveroom?.cover_img"
      class="cover"
    >
      <div
        v-if="liveroom?.live"
        class="living-ico"
      >
        直播中
      </div>
      <div
        v-if="
          [
            LiveRoomTypeEnum.tencentcloud_css,
            LiveRoomTypeEnum.tencentcloud_css_pk,
          ].includes(liveroom?.type!)
        "
        class="cdn-ico"
      >
        <div class="txt">CDN</div>
      </div>
      <div class="txt">
        {{ liveroom?.title }}
      </div>
    </div>
    <div class="desc">
      <div class="avatar">
        <Avatar
          :url="user?.avatar"
          :name="user?.username"
          :size="24"
        ></Avatar>
      </div>
      <div class="info">
        {{ user?.username }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';

withDefaults(
  defineProps<{
    liveroom?: ILiveRoom;
    user?: IUser;
  }>(),
  {}
);
</script>

<style lang="scss" scoped>
.liveroom-item {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 43vw;
  cursor: pointer;
  .cover {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    width: 43vw;
    height: calc(43vw / $video-ratio);
    border-radius: 8px;
    transition: background-image 0.5s ease;

    @extend %coverBg;
    .living-ico {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 10;
      padding: 0 10px;
      height: 20px;
      border-radius: 8px 0 10px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
    }
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
      height: 26px;
      border-radius: 0 0 4px 4px;
      background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0,
        rgba(0, 0, 0, 0.32) 100%
      );
      color: white;
      text-align: initial;
      font-size: 13px;

      @extend %singleEllipsis;
    }
  }
  .desc {
    display: flex;
    padding: 10px 0;
    font-size: 14px;

    .info {
      display: flex;
      align-items: center;
      margin-left: 10px;
      width: calc(100% - 10px);
      color: #333;

      @extend %singleEllipsis;
    }
  }
}
</style>
