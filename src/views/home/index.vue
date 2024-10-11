<template>
  <div
    class="home-wrap"
    ref="docRef"
  >
    <div class="play-container">
      <div
        v-if="configBg && configBg !== ''"
        class="bg-img"
        :style="{
          backgroundImage: `url(${configBg})`,
        }"
      ></div>
      <video
        v-if="configVideo && configVideo !== ''"
        class="bg-video"
        :src="configVideo"
        muted
        autoplay
        loop
      ></video>
      <!-- <div class="slider-wrap">
        <div
          v-for="(item, index) in interactionList"
          :key="index"
        >
          <Slider
            v-if="item.length"
            :list="item"
            :width="docW"
            :speed="60"
            :direction="index % 2 === 0 ? 'l-r' : 'r-l'"
            :customStyle="{ margin: '0 auto' }"
          ></Slider>
        </div>
      </div> -->

      <div class="container">
        <div
          v-loading="videoLoading"
          class="left"
          ref="videoWrapTmpRef"
          @click="showJoinBtn = !showJoinBtn"
        >
          <div
            v-if="
              appStore.liveRoomInfo?.cdn === LiveRoomUseCDNEnum.yes &&
              [
                LiveRoomTypeEnum.tencent_css,
                LiveRoomTypeEnum.tencent_css_pk,
              ].includes(appStore.liveRoomInfo!.type!)
            "
            class="cdn-ico"
          >
            <div class="txt">CDN</div>
          </div>
          <div class="billd-logo">Billd直播</div>
          <div
            class="cover"
            :style="{
              backgroundImage: `url(${
                appStore.liveRoomInfo?.cover_img ||
                appStore.liveRoomInfo?.user?.avatar
              })`,
            }"
          ></div>
          <div
            v-if="appStore.liveRoomInfo?.flv_url"
            ref="remoteVideoRef"
          ></div>
          <template v-if="appStore.liveRoomInfo">
            <div class="video-controls">
              <VideoControls
                :resolution="videoResolution"
                @refresh="handleRefresh"
                :control="{
                  line: true,
                }"
              ></VideoControls>
            </div>

            <div
              class="join-btn"
              :class="{
                show: showJoinBtn,
              }"
            >
              <div
                class="btn"
                @click="joinRoom(appStore.liveRoomInfo)"
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
                active: item.live_room_id === appStore.liveRoomInfo?.id,
              }"
              :style="{
                backgroundImage: `url(${
                  item.live_room?.cover_img || item?.user?.avatar
                })`,
              }"
              @click="changeLiveRoom(item)"
            >
              <PullAuthTip
                v-if="
                  item.live_room?.pull_is_should_auth ===
                  LiveRoomPullIsShouldAuthEnum.yes
                "
              ></PullAuthTip>
              <div class="hidden">
                <div
                  class="cdn-ico"
                  v-if="
                    item?.live_room?.cdn === LiveRoomUseCDNEnum.yes &&
                    [
                      LiveRoomTypeEnum.tencent_css,
                      LiveRoomTypeEnum.tencent_css_pk,
                    ].includes(item.live_room!.type!)
                  "
                >
                  <div class="txt">CDN</div>
                </div>
              </div>
              <div
                class="border"
                :style="{
                  opacity:
                    item.live_room_id === appStore.liveRoomInfo?.id ? 1 : 0,
                }"
              ></div>
              <div
                v-if="item.live_room_id === appStore.liveRoomInfo?.id"
                class="triangle"
              ></div>
              <div class="txt">{{ item.live_room?.name }}</div>
            </div>
          </div>
          <div
            v-else
            class="none"
          >
            {{ t('home.noliveRoomTip') }}
          </div>
        </div>
      </div>
    </div>
    <div class="area-container">
      <div class="area-item">
        <div class="title">{{ t('home.recommendLive') }}</div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in otherLiveRoomList"
            :key="indey"
            class="live-room"
            @click="joinRoom(iten.live_room)"
          >
            <div
              class="cover"
              v-lazy:background-image="
                iten?.live_room?.cover_img || iten?.user?.avatar
              "
            >
              <PullAuthTip
                v-if="
                  iten.live_room?.pull_is_should_auth ===
                  LiveRoomPullIsShouldAuthEnum.yes
                "
              ></PullAuthTip>
              <div
                v-if="
                  iten?.live_room?.cdn === LiveRoomUseCDNEnum.yes &&
                  [
                    LiveRoomTypeEnum.tencent_css,
                    LiveRoomTypeEnum.tencent_css_pk,
                  ].includes(iten.live_room!.type!)
                "
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
            {{ t('common.nonedata') }}
          </div>
        </div>
      </div>
      <div class="area-item">
        <div class="title">{{ t('home.bilibiliLive') }}</div>
        <div class="live-room-list">
          <div
            v-for="(iten, indey) in bilibiliLiveRoomList"
            :key="indey"
            class="live-room"
            @click="joinRoom(iten.live_room)"
          >
            <div
              class="cover"
              v-lazy:background-image="
                iten?.live_room?.cover_img || iten?.user?.avatar
              "
            >
              <PullAuthTip
                v-if="
                  iten.live_room?.pull_is_should_auth ===
                  LiveRoomPullIsShouldAuthEnum.yes
                "
              ></PullAuthTip>
              <div
                v-if="
                  iten?.live_room?.cdn === LiveRoomUseCDNEnum.yes &&
                  [
                    LiveRoomTypeEnum.tencent_css,
                    LiveRoomTypeEnum.tencent_css_pk,
                  ].includes(iten.live_room!.type!)
                "
                class="cdn-ico"
              >
                <div class="txt">CDN</div>
              </div>
              <div class="txt">{{ iten?.user?.username }}</div>
            </div>
            <div class="desc">{{ iten?.live_room?.name }}</div>
          </div>
          <div
            v-if="bilibiliLoading"
            class="null"
          >
            {{ t('common.loading') }}
          </div>
          <div
            v-else-if="!bilibiliLiveRoomList.length"
            class="null"
          >
            {{ t('common.nonedata') }}
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      style="position: fixed; bottom: 200px; right: 0; background-color: red"
    >
      {{ isBottom }}
    </div>
     -->
    <div ref="loadMoreRef"></div>
    <div class="foot">*{{ t('home.copyrightTip') }}~</div>
  </div>
  <div class="ad-wrap-a">
    <!-- live-首页广告位1 -->
    <ins
      class="adsbygoogle"
      style="display: block"
      data-ad-client="ca-pub-6064454674933772"
      data-ad-slot="3325489849"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { fetchLiveBilibiliGetUserRecommend } from '@/api/bilibili';
import { fetchLiveList } from '@/api/live';
import { fetchFindLiveConfigByKey } from '@/api/liveConfig';
import { sliderList } from '@/constant';
import { usePull } from '@/hooks/use-pull';
import { ILive, LiveLineEnum } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import {
  ILiveRoom,
  LiveRoomIsShowEnum,
  LiveRoomPullIsShouldAuthEnum,
  LiveRoomTypeEnum,
  LiveRoomUseCDNEnum,
} from '@/types/ILiveRoom';

const router = useRouter();
const appStore = useAppStore();
const canvasRef = ref<Element>();
const bilibiliLoading = ref(false);
const showJoinBtn = ref(false);
const topNums = ref(6);
const configBg = ref('');
const configVideo = ref();
// const configVideo = ref(
//   'https://www.xdyun.com/resldmnqcom/ldq_website/all_ldy/cloudphone_xdyun_ldy_mobile/mobile/assets/xd-video-6c9bcd.mp4'
// );
const topLiveRoomList = ref<ILive[]>([]);
const otherLiveRoomList = ref<ILive[]>([]);
const bilibiliLiveRoomList = ref<ILive[]>([]);
const interactionList = ref<any[]>([]);
const videoWrapTmpRef = ref<HTMLDivElement>();
const remoteVideoRef = ref<HTMLDivElement>();
const docRef = ref<HTMLElement | null>();
const loadMoreRef = ref<HTMLElement | null>();

const pageParams = reactive({ page: 0, page_size: 30, platform: 'web' });
const { t } = useI18n();
const {
  videoWrapRef,
  videoLoading,
  roomLiving,
  videoResolution,
  handleStopDrawing,
  handlePlay,
} = usePull();
const isBottom = ref(false);
const rootMargin = {
  bottom: 600,
  top: 0,
  left: 0,
  right: 0,
};

onMounted(() => {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          isBottom.value = true;
        } else {
          isBottom.value = false;
        }
      });
    },
    {
      // root: '',
      rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
    }
  );
  intersectionObserver.observe(loadMoreRef.value!);
  handleSlideList();
  getLiveRoomList();
  getBg();
  videoWrapRef.value = videoWrapTmpRef.value;
});

watch(
  () => isBottom.value,
  async (newval) => {
    if (newval) {
      const arr = await handleBilibilData();
      bilibiliLiveRoomList.value.push(...arr);
    }
  },
  {
    immediate: true,
  }
);

async function handleBilibilData() {
  if (bilibiliLoading.value) return [];
  bilibiliLoading.value = true;
  let arr: any = [];
  try {
    pageParams.page += 1;
    const res = await fetchLiveBilibiliGetUserRecommend(pageParams);
    // const list = res.data?.list;
    const list = res?.data?.data?.list;
    if (list) {
      arr = list.map((item) => {
        return {
          id: item.roomid,
          user: { username: item.uname },
          live_room: {
            id: item.roomid,
            name: item.title,
            cover_img: item.cover,
            is_bilibili: 1,
          },
        };
      });
    }
  } catch (error) {
    pageParams.page -= 1;
    console.log(error);
  }
  bilibiliLoading.value = false;
  return arr;
}

function handleSlideList() {
  const row = 2;
  const res: any[] = [];
  const count = Math.ceil(sliderList.length / row);
  for (let i = 0, len = sliderList.length; i < len; i += count) {
    const item = sliderList.slice(i, i + count);
    res.push([...item]);
  }
  interactionList.value = res;
}

async function getBg() {
  try {
    const res = await fetchFindLiveConfigByKey('frontend_live_home_bg');
    if (res.code === 200) {
      const reg = /.+\.mp4$/g;
      const url = res.data.value as string;
      if (reg.exec(url)) {
        configVideo.value = res.data.value;
      } else {
        configBg.value = res.data.value;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handleRefresh() {
  playLive(appStore.liveRoomInfo!);
}

function playLive(item: ILiveRoom) {
  handleStopDrawing();
  canvasRef.value?.childNodes?.forEach((item) => {
    item.remove();
  });
  // roomLiving.value = true;
  appStore.liveRoomInfo = item;
  handlePlay(item);
}

function changeLiveRoom(item: ILive) {
  if (item.id === appStore.liveRoomInfo?.id) return;
  if (
    ![
      LiveRoomTypeEnum.wertc_live,
      LiveRoomTypeEnum.wertc_meeting_one,
      LiveRoomTypeEnum.wertc_meeting_two,
    ].includes(item.live_room!.type!)
  ) {
    appStore.setLiveLine(LiveLineEnum.hls);
  }
  playLive(item.live_room!);
}

async function getLiveRoomList() {
  try {
    const res = await fetchLiveList({
      live_room_is_show: LiveRoomIsShowEnum.yes,
      orderName: 'created_at',
      orderBy: 'desc',
    });
    if (res.code === 200) {
      // const arr: IBilibiliLiveUserRecommend[] = await handleBilibilData();
      // first.value = false;
      // @ts-ignore
      // res.data.rows.push(...arr);
      topLiveRoomList.value = res.data.rows.slice(0, topNums.value);
      otherLiveRoomList.value = res.data.rows.slice(topNums.value);
      if (res.data.total) {
        roomLiving.value = true;
        appStore.liveRoomInfo = topLiveRoomList.value[0].live_room;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function joinRoom(data) {
  const url = router.resolve({
    name: routerName.pull,
    params: { roomId: data.id },
    query: { is_bilibili: data.is_bilibili },
  });
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.home-wrap {
  // overflow: scroll;
  // height: 100vh;
  // height: calc(100vh - $header-height);
  .play-container {
    position: relative;
    z-index: 1;
    padding-bottom: 50px;
    .bg-img {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .bg-video {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
    }
    .slider-wrap {
      padding: 4px 0;
    }
    .container {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      margin: 0 auto;
      padding-top: 20px;
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
        .billd-logo {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          color: rgba($color: #fff, $alpha: 0.4);
          font-weight: bold;
          font-size: 30px;
        }

        .cover {
          position: absolute;
          background-position: center center;
          background-size: cover;
          filter: blur(5px);

          inset: 0;
        }
        :deep(canvas) {
          position: absolute;
          top: 50%;
          left: 50%;
          // min-width: 100%;
          // min-height: 100%;
          max-width: $w-1100;
          max-height: calc($w-1100 / $video-ratio);
          transform: translate(-50%, -50%);

          user-select: none;
        }
        :deep(video) {
          position: absolute;
          top: 50%;
          left: 50%;
          // min-width: 100%;
          // min-height: 100%;
          max-width: $w-1100;
          max-height: calc($w-1100 / $video-ratio);
          transform: translate(-50%, -50%);

          user-select: none;
        }
        .join-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 20;
          display: none;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          // width: 80%;
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
        .video-controls {
          display: none;
        }

        &:hover {
          .join-btn {
            display: block;
          }
          .video-controls {
            display: block;
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
      .live-room-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
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
        .null {
          width: 100%;
          text-align: center;
        }
      }
    }
  }

  .foot {
    margin-top: 10px;
    text-align: center;
  }
}

.ad-wrap-a {
  position: fixed;
  top: 300px;
  left: 10px;
  // background-color: red;
  z-index: 999;
  width: 250px;
  // height: 150px;
  border-radius: 10px;
  ins {
    width: 100%;
    height: 100%;
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
          :deep(canvas) {
            max-width: $w-900;
            max-height: calc($w-900 / $video-ratio);
          }
          :deep(video) {
            max-width: $w-900;
            max-height: calc($w-900 / $video-ratio);
          }
        }
      }
    }
    .area-container {
      width: $w-1150;
      .area-item {
        .live-room-list {
          .live-room {
            width: 250px;
          }
        }
      }
    }
  }
}
</style>
