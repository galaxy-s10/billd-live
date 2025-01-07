<template>
  <div class="wrap">
    <div class="title">开播设置</div>
    <div
      v-if="liveRoomInfo"
      class="card-top"
    >
      <div class="avatar-wrap">
        <div
          v-if="userStore.userInfo?.avatar"
          class="avatar"
          :style="{
            backgroundImage: `url(${userStore.userInfo?.avatar})`,
          }"
        ></div>
        <div
          v-else
          class="avatar"
        ></div>
      </div>
      <div class="name-bar">
        <div class="name">{{ liveRoomInfo.name }}</div>
      </div>
      <div class="info-bar">
        <div class="item id">
          <span>
            直播间ID：<span class="val">{{ liveRoomInfo.id }}</span>
          </span>
          <span
            class="copy"
            @click="handleCopy(liveRoomInfo.id!)"
          >
            复制ID
          </span>
        </div>
        <div class="item url">
          <span>
            直播间链接：<span class="val">{{
              getLiveRoomPageUrl(liveRoomInfo.id!)
            }}</span>
          </span>
          <span
            class="copy"
            @click="handleCopy(getLiveRoomPageUrl(liveRoomInfo.id!))"
          >
            复制链接
          </span>
        </div>
      </div>
    </div>
    <div class="card">
      <div v-if="liveRoomInfo">
        <div class="title">直播分区：</div>
        <div class="area-wrap">
          <span v-if="selectArea.length">{{
            selectArea?.map((v) => v.name).join(' · ')
          }}</span>
          <span
            v-else
            class="pointer"
            @click="showAreaModal = true"
          >
            选择分区
          </span>
          <span
            v-if="selectArea.length"
            class="save"
            @click="showAreaModal = true"
          >
            修改分区
          </span>
          <span
            v-else
            class="area-tip red"
          >
            必须选择分区才能开播</span
          >
        </div>
        <div class="title">房间标题：</div>
        <div class="ipt-wrap">
          <div class="ipt">
            <n-input
              v-model:value="title"
              placeholder=""
              maxlength="20"
              show-count
              clearable
            />
          </div>
          <span
            class="save"
            @click="handleUpdateMyLiveRoomTitle"
          >
            保存
          </span>
        </div>
        <div class="title">谁可以看：</div>
        <div class="limit-wrap">
          <div
            class="limit-item"
            :class="{ active: watchLimit === 'all' }"
            @click="watchLimit = 'all'"
          >
            <div class="name">公开直播</div>
            <div class="desc">所有人可见该场直播内容</div>
          </div>
          <div
            class="limit-item disabled"
            :class="{ active: watchLimit === 'fans' }"
            @click="handleTip"
          >
            <div class="name">粉丝专属</div>
            <div class="desc">粉丝用户可见该场直播内容</div>
          </div>
        </div>
        <div class="title">直播方式：</div>
        <div class="method-wrap">
          <div
            class="method-item"
            :class="{ active: methodLimit === 'srs' }"
            @click="handleMethodLimit('srs')"
          >
            <div class="name">普通直播</div>
          </div>
          <div
            class="method-item"
            :class="{
              active: methodLimit === 'cdn',
            }"
            @click="handleMethodLimit('cdn')"
          >
            <div class="name">CDN直播</div>
          </div>
        </div>
        <div
          class="btn-wrap"
          @click="handleStartLive"
        >
          {{ !startLive ? '开始直播' : '结束直播' }}
        </div>
        <div
          v-if="startLive"
          class="obs-wrap"
        >
          <div class="obs-item">
            <div class="obs-ipt-wrap">
              <div>OBS服务器：</div>
              <div class="ipt">
                <input
                  :value="
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_obs_server
                      : liveRoomInfo.push_obs_server
                  "
                  class="val disabled"
                  type="text"
                  disabled
                />
              </div>
              <div
                class="copy"
                @click="
                  handleCopy(
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_obs_server!
                      : liveRoomInfo.push_obs_server!
                  )
                "
              >
                复制
              </div>
            </div>
            <div class="obs-ipt-wrap">
              <div>OBS推流码：</div>
              <div class="ipt">
                <input
                  :value="
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_obs_stream_key
                      : liveRoomInfo.push_obs_stream_key
                  "
                  class="val padding disabled"
                  type="text"
                  disabled
                />
                <div
                  class="update"
                  @click="handleUpdateKey"
                ></div>
              </div>
              <div
                class="copy"
                @click="
                  handleCopy(
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_obs_stream_key!
                      : liveRoomInfo.push_obs_stream_key!
                  )
                "
              >
                复制
              </div>
            </div>
          </div>
          <div class="obs-item">
            <div class="obs-ipt-wrap">
              <div>RTMP推流地址：</div>
              <div class="ipt">
                <input
                  :value="
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_rtmp_url
                      : liveRoomInfo.push_rtmp_url
                  "
                  class="val disabled"
                  type="text"
                  disabled
                />
              </div>
              <div
                class="copy"
                @click="
                  handleCopy(
                    methodLimit === 'cdn'
                      ? liveRoomInfo.push_cdn_obs_server!
                      : liveRoomInfo.push_obs_server!
                  )
                "
              >
                复制
              </div>
            </div>
          </div>
        </div>
        <div class="tip">
          <p>使用第三方软件开播的用户点击开始直播后获取服务器地址和推流码。</p>
          <p>
            快速体验：<span
              class="link"
              @click="openLiveRoom"
            >
              web在线直播
            </span>
          </p>
        </div>
      </div>
      <span
        v-else
        class="link"
        @click="openLiveRoom"
      >
        未开通直播间
      </span>
    </div>

    <div class="card notice">
      <div class="title">主播公告</div>
      <div class="ipt-wrap">
        <div class="ipt">
          <n-input
            v-model:value="noticeMsg"
            placeholder=""
            maxlength="100"
            show-count
            clearable
          />
        </div>
      </div>
      <div
        class="save-btn"
        :class="{ active: noticeMsg.length }"
        @click="handleUpdateMyLiveRoomNotice"
      >
        保存
      </div>
    </div>

    <div class="card cover">
      <div class="title">直播封面</div>
      <div class="cover-wrap">
        <div
          class="cover-img"
          :style="{
            backgroundImage: `url(${coverImg})`,
          }"
        ></div>
        <div
          class="save-btn"
          :class="{ active: coverImg.length }"
          @click="handleUpdateMyLiveRoomCover"
        >
          更换封面
        </div>
      </div>
    </div>
    <AreaModal
      v-if="showAreaModal"
      @close="showAreaModal = false"
      @confirm="handleConfirm"
    ></AreaModal>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { computed, ref, toRefs, watch } from 'vue';

import { fetchUpdateLiveRoomKey, fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { DEFAULT_ROLE_INFO, URL_QUERY } from '@/constant';
import { handleTip } from '@/hooks/use-common';
import { loginTip } from '@/hooks/use-login';
import { IArea } from '@/interface';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
const liveRoomInfo = ref<ILiveRoom>();
const updateKeyLoading = ref(false);
const title = ref('');
const noticeMsg = ref('');
const coverImg = ref('');
const watchLimit = ref('all');
const methodLimit = ref('srs');
const selectArea = ref<IArea[]>([]);
const startLive = ref(false);
const showAreaModal = ref(false);

const isSuperAdmin = computed(() => {
  return userInfo?.value?.roles?.find(
    (v) => v.role_value === DEFAULT_ROLE_INFO.SUPER_ADMIN.role_value
  );
});

watch(
  () => userInfo?.value,
  (newval) => {
    const res = newval?.live_rooms?.[0];
    if (res) {
      liveRoomInfo.value = res;
      title.value = res.name || '';
      noticeMsg.value = res.notice_msg || '';
      coverImg.value = res.cover_img || '';
    }
  },
  {
    immediate: true,
  }
);

async function handleUpdateKey() {
  try {
    updateKeyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200 && userStore.userInfo?.live_rooms?.[0]) {
      userStore.userInfo.live_rooms[0].push_obs_server =
        res.data.srsPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_obs_stream_key =
        res.data.srsPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_rtmp_url =
        res.data.srsPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_srt_url =
        res.data.srsPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_webrtc_url =
        res.data.srsPushRes.webrtc_url;
      userStore.userInfo.live_rooms[0].push_cdn_obs_server =
        res.data.cdnPushRes.obs_server;
      userStore.userInfo.live_rooms[0].push_cdn_obs_stream_key =
        res.data.cdnPushRes.obs_stream_key;
      userStore.userInfo.live_rooms[0].push_cdn_rtmp_url =
        res.data.cdnPushRes.rtmp_url;
      userStore.userInfo.live_rooms[0].push_cdn_srt_url =
        res.data.cdnPushRes.srt_url;
      userStore.userInfo.live_rooms[0].push_cdn_webrtc_url =
        res.data.cdnPushRes.webrtc_url;
      window.$message.success('更新成功！');
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}

function handleConfirm(v) {
  selectArea.value = v;
  showAreaModal.value = false;
}

function handleMethodLimit(val) {
  if (val === 'cdn' && !isSuperAdmin.value) {
    window.$message.error('权限不足！');
    return;
  }
  methodLimit.value = val;
}
function handleStartLive() {
  startLive.value = !startLive.value;
}

function handleCopy(url: string | number) {
  copyToClipBoard(`${url}`);
  window.$message.success('复制成功！');
}

async function handleUpdateMyLiveRoomTitle() {
  if (!title.value.length) {
    window.$message.warning('房间标题不能为空！');
    return;
  }
  const res = await fetchUpdateMyLiveRoom({
    name: title.value,
  });
  if (res.code === 200) {
    window.$message.success('修改成功！');
  }
}

async function handleUpdateMyLiveRoomNotice() {
  if (!noticeMsg.value.length) {
    window.$message.warning('公告不能为空！');
    return;
  }
  const res = await fetchUpdateMyLiveRoom({
    notice_msg: noticeMsg.value,
  });
  if (res.code === 200) {
    window.$message.success('修改成功！');
  }
}
async function handleUpdateMyLiveRoomCover() {
  if (!coverImg.value.length) {
    window.$message.warning('公告不能为空！');
    return;
  }
  const res = await fetchUpdateMyLiveRoom({
    cover_img: coverImg.value,
  });
  if (res.code === 200) {
    window.$message.success('修改成功！');
  }
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { [URL_QUERY.liveType]: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}
</script>

<style lang="scss" scoped>
.wrap {
  .title {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
  }
  .card-top {
    position: relative;
    margin-top: 60px;
    margin-bottom: 20px;
    padding: 20px 30px;
    width: 50%;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;

    .avatar-wrap {
      position: absolute;
      top: -40px;
      left: 30px;
      width: 90px;
      height: 90px;
      border: 2px solid #ececec;
      border-radius: 50%;
      .avatar {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid white;
        border-radius: 50%;
        background-color: white;
        background-image: url('@/assets/img/default-avatar.png');

        @extend %containBg;
      }
    }
    .name-bar {
      box-sizing: border-box;
      padding-top: 10px;
      padding-bottom: 25px;
      padding-left: 105px;
      width: 100%;
      border-bottom: 1px solid #e3e8ec;
    }
    .info-bar {
      box-sizing: border-box;
      padding-top: 30px;
      width: 100%;
      font-size: 12px;
      .item {
        margin-bottom: 20px;
        .val {
          color: $theme-color-gold;
          font-size: 16px;
        }
        .copy {
          margin-left: 30px;
          color: $theme-color-gold;
          cursor: pointer;
        }
      }
    }
  }
  .card {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .link {
      color: $theme-color-gold;
      cursor: pointer;
    }
    .red {
      color: red;
    }
    .pointer {
      cursor: pointer;
    }
    .title {
      font-size: 20px;
    }
    .ipt-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .ipt {
        margin-right: 10px;
        width: 300px;
      }
      .save {
        color: #999;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .area-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 12px;
      .save {
        margin-left: 20px;
        color: $theme-color-gold;
        font-size: 12px;
        cursor: pointer;
      }
      .area-tip {
        margin-left: 20px;
      }
    }
    .limit-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .limit-item {
        box-sizing: border-box;
        margin-right: 20px;
        padding: 10px 20px;
        width: 200px;
        border: 1px solid #e9eaec;
        border-radius: 5px;
        cursor: pointer;

        user-select: none;
        &.active {
          border: 1px solid $theme-color-gold;
          .name {
            color: #000;
          }
        }
        &.disabled {
          cursor: no-drop;
        }
        .name {
          color: #98a4ad;
          font-weight: bold;
          font-size: 16px;
        }
        .desc {
          margin-top: 4px;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .method-wrap {
      display: flex;
      align-items: center;
      .method-item {
        box-sizing: border-box;
        margin-right: 20px;
        padding: 10px 20px;
        width: 200px;
        border: 1px solid #e9eaec;
        border-radius: 5px;
        cursor: pointer;

        user-select: none;
        &.active {
          border: 1px solid $theme-color-gold;
          .name {
            color: #000;
          }
        }
        &.disabled {
          cursor: no-drop;
        }
        .name {
          color: #98a4ad;
          font-weight: bold;
          font-size: 16px;
        }
        .desc {
          margin-top: 4px;
          color: #999;
          font-size: 12px;
        }
      }
    }
    .btn-wrap {
      margin-top: 20px;
      width: 120px;
      height: 32px;
      border-radius: 4px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      line-height: 32px;
      cursor: pointer;

      user-select: none;
    }
    .obs-wrap {
      margin: 20px auto 20px;
      padding: 20px;
      border-radius: 8px;
      background: #f5f5f8;
      color: #666;
      font-size: 14px;

      .obs-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 15px;
        }
        .obs-ipt-wrap {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          &.full {
            width: 100%;
          }
          .ipt {
            position: relative;
            box-sizing: border-box;
            width: 300px;
            .val {
              box-sizing: border-box;
              padding: 4px 8px 4px 8px;
              width: 100%;
              border: 1px solid #e9eaec;
              border-radius: 4px;
              background-color: #fff;
              &.padding {
                padding: 4px 30px 4px 8px;
              }
              &.disabled {
                color: #aaa;
                cursor: no-drop;
              }
            }
            .update {
              position: absolute;
              top: 50%;
              right: 10px;
              width: 15px;
              height: 15px;
              cursor: pointer;
              transform: translate(0, -50%);

              @include setBackground('@/assets/img/update.png');
            }
          }
          .copy {
            margin-left: 10px;
            color: $theme-color-gold;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
    }
    .tip {
      margin-top: 10px;
      color: #999;
      font-size: 14px;
    }
  }
  .card {
    &.notice {
      .ipt-wrap {
        .ipt {
          width: 100%;
        }
      }
      .save-btn {
        width: 100px;
        height: 32px;
        border-radius: 4px;
        background-color: #e9eaec;
        color: #b4b4b4;
        text-align: center;
        text-align: center;
        font-size: 14px;
        line-height: 32px;
        cursor: pointer;
        &.active {
          background-color: $theme-color-gold;
          color: white;
        }
      }
    }
  }
  .card {
    &.cover {
      width: 400px;

      .cover-wrap {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding-top: 10px;
        .cover-img {
          margin-bottom: 15px;
          width: 200px;
          height: calc(200px / $video-ratio);
          border-radius: 6px;

          @extend %coverBg;
        }
        .save-btn {
          width: 120px;
          height: 32px;
          border-radius: 4px;
          background-color: #e9eaec;
          color: #b4b4b4;
          text-align: center;
          text-align: center;
          font-size: 14px;
          line-height: 32px;
          cursor: pointer;
          &.active {
            background-color: $theme-color-gold;
            color: white;
          }
        }
      }
    }
  }
}
</style>
