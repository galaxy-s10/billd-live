<template>
  <div class="liveroom-item">
    <div class="hover-item">
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
          {{ liveroom?.areas?.map((v) => v.name).join() }}
        </div>
      </div>
      <div class="desc">
        <div class="avatar">
          <Avatar
            :url="liveroom?.users?.[0]?.avatar"
            :name="liveroom?.users?.[0]?.username"
            :size="40"
          ></Avatar>
        </div>
        <div class="info">
          <div class="top">{{ liveroom?.name }}</div>
          <div class="bottom">
            <div class="username">{{ liveroom?.users?.[0]?.username }}</div>
            <div class="view"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';

withDefaults(
  defineProps<{
    liveroom?: ILiveRoom;
  }>(),
  {}
);
</script>

<style lang="scss" scoped>
.liveroom-item {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  margin-bottom: 10px;
  width: 276px;
  height: 207px;
  cursor: pointer;
  .hover-item {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 276px;
    &:hover {
      top: -10%;
      left: -6%;
      z-index: 20;
      padding: 10px 2px 0;
      width: 306px;
      border: 1px solid #e3e5e7;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 13px 20px 0 rgba(59, 64, 72, 0.22);
      .cover {
        width: 281px;
        height: calc(281px / $video-ratio);
      }
    }
    .cover {
      position: relative;
      overflow: hidden;
      margin: 0 auto;
      width: 256px;
      height: calc(256px / $video-ratio);
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
      padding: 10px;
      font-size: 14px;

      .info {
        margin-left: 10px;
        // width: 100%;
        width: calc(100% - 50px);
        color: #333;

        .top {
          @extend %singleEllipsis;
        }
        .bottom {
          color: #999;
        }
      }
    }
  }
}
</style>
