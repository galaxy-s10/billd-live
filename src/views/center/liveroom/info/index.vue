<template>
  <div class="wrap">
    <div class="title">直播间信息</div>
    <div
      v-if="liveRoomInfo"
      class="card"
    >
      <div class="pull-url">
        <span
          v-if="!userStore.userInfo?.live_rooms?.length"
          class="link"
          @click="openLiveRoom"
        >
          未开通
        </span>
        <div v-else>
          <div>
            直播间ID：
            <a
              :href="getLiveRoomPageUrl(liveRoomInfo.id!)"
              class="link"
              target="_blank"
            >
              {{ liveRoomInfo.id }}
            </a>
          </div>
          <div>直播间名称：{{ liveRoomInfo.name }}</div>
          <div>直播间简介：{{ liveRoomInfo.desc || '暂无简介' }}</div>
          <div>
            直播间分区：{{ liveRoomInfo.areas?.[0]?.name || '暂无分区' }}
          </div>
          <div>开通时间：{{ liveRoomInfo.created_at }}</div>

          <div
            v-if="
              userStore.userInfo?.auths?.find(
                (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PUSH.auth_value
              )
            "
            v-loading="updateKeyLoading"
            class="url-wrap"
          >
            <div
              class="link"
              @click="handleUpdateKey"
            >
              更新地址
            </div>

            <div class="srs">
              <div>
                <span> RTMP推流地址：{{ liveRoomInfo.push_rtmp_url! }}， </span>
                <span
                  class="link"
                  @click="handleCopy(liveRoomInfo.push_rtmp_url!)"
                >
                  复制
                </span>
              </div>
              <div>
                <span>OBS服务器：{{ liveRoomInfo.push_obs_server! }}，</span>
                <span
                  class="link"
                  @click="handleCopy(liveRoomInfo.push_obs_server!)"
                >
                  复制
                </span>
              </div>
              <div>
                <span
                  >OBS推流码：{{ liveRoomInfo.push_obs_stream_key! }}，</span
                >
                <span
                  class="link"
                  @click="handleCopy(liveRoomInfo.push_obs_stream_key!)"
                >
                  复制
                </span>
              </div>
            </div>

            <br />

            <div>
              CDN直播：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PULL_SVIP.auth_value
                  )
                "
                class="cdn"
              >
                <div>
                  <span>
                    RTMP推流地址（CDN）：{{ liveRoomInfo.push_cdn_rtmp_url! }}，
                  </span>
                  <span
                    class="link"
                    @click="handleCopy(liveRoomInfo.push_cdn_rtmp_url!)"
                  >
                    复制
                  </span>
                </div>
                <div>
                  <span>
                    OBS服务器（CDN）：{{ liveRoomInfo.push_cdn_obs_server! }}，
                  </span>
                  <span
                    class="link"
                    @click="handleCopy(liveRoomInfo.push_cdn_obs_server!)"
                  >
                    复制
                  </span>
                </div>
                <div>
                  <span>
                    OBS推流码（CDN）：{{
                      liveRoomInfo.push_cdn_obs_stream_key!
                    }}，
                  </span>
                  <span
                    class="link"
                    @click="handleCopy(liveRoomInfo.push_cdn_obs_stream_key!)"
                  >
                    复制
                  </span>
                </div>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推b站：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_BILIBILI.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_bilibili_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推b站url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推虎牙：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_HUYA.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_huya_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推虎牙url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推斗鱼：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_DOUYU.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_douyu_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推斗鱼url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推抖音：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_DOUYIN.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_douyin_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推抖音url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推小红书：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_XIAOHONGSHU.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_xiaohongshu_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推小红书url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>

            <div>
              转推快手：
              <div
                v-if="
                  userStore.userInfo?.auths?.find(
                    (v) =>
                      v.auth_value ===
                      DEFAULT_AUTH_INFO.LIVE_PUSH_FORWARD_KUAISHOU.auth_value
                  )
                "
                class="cdn"
              >
                <n-input-group>
                  <n-input
                    v-model:value="liveRoomInfo.forward_kuaishou_url"
                    style="width: 500px"
                    type="text"
                    placeholder="请输入转推快手url"
                  />

                  <n-button
                    type="primary"
                    ghost
                    @click="handleUpdateMyLiveRoom()"
                  >
                    更新
                  </n-button>
                </n-input-group>
              </div>
              <div
                v-else
                class="link"
                @click="router.push({ name: routerName.author })"
              >
                请联系作者开通~
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { ref, toRefs, watch } from 'vue';

import { fetchUpdateLiveRoomKey, fetchUpdateMyLiveRoom } from '@/api/liveRoom';
import { DEFAULT_AUTH_INFO, URL_QUERY } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const { userInfo } = toRefs(userStore);
const liveRoomInfo = ref<ILiveRoom>();
const updateKeyLoading = ref(false);

watch(
  () => userInfo?.value,
  (newval) => {
    console.log('newval', newval);
    const res = newval?.live_rooms?.[0];
    if (res) {
      liveRoomInfo.value = res;
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
    if (res.code === 200 && liveRoomInfo) {
      // userStore.userInfo.live_rooms[0].push_obs_server =
      //   res.data.srsPushRes.obs_server;
      // userStore.userInfo.live_rooms[0].push_obs_stream_key =
      //   res.data.srsPushRes.obs_stream_key;
      // userStore.userInfo.live_rooms[0].push_rtmp_url =
      //   res.data.srsPushRes.rtmp_url;
      // userStore.userInfo.live_rooms[0].push_srt_url =
      //   res.data.srsPushRes.srt_url;
      // userStore.userInfo.live_rooms[0].push_webrtc_url =
      //   res.data.srsPushRes.webrtc_url;
      // userStore.userInfo.live_rooms[0].push_cdn_obs_server =
      //   res.data.cdnPushRes.obs_server;
      // userStore.userInfo.live_rooms[0].push_cdn_obs_stream_key =
      //   res.data.cdnPushRes.obs_stream_key;
      // userStore.userInfo.live_rooms[0].push_cdn_rtmp_url =
      //   res.data.cdnPushRes.rtmp_url;
      // userStore.userInfo.live_rooms[0].push_cdn_srt_url =
      //   res.data.cdnPushRes.srt_url;
      // userStore.userInfo.live_rooms[0].push_cdn_webrtc_url =
      //   res.data.cdnPushRes.webrtc_url;
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}

function handleCopy(url: string) {
  copyToClipBoard(url);
  window.$message.success('复制成功！');
}

async function handleUpdateMyLiveRoom() {
  const res = await fetchUpdateMyLiveRoom({
    forward_bilibili_url: liveRoomInfo.value?.forward_bilibili_url,
    forward_douyin_url: liveRoomInfo.value?.forward_douyin_url,
    forward_douyu_url: liveRoomInfo.value?.forward_douyu_url,
    forward_huya_url: liveRoomInfo.value?.forward_huya_url,
    forward_kuaishou_url: liveRoomInfo.value?.forward_kuaishou_url,
    forward_xiaohongshu_url: liveRoomInfo.value?.forward_xiaohongshu_url,
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
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  .card {
    padding: 20px;
    border: 1px solid #e9eaec;
    border-radius: 12px;
    background-color: white;
    background-color: white;
    .link {
      cursor: pointer;
      color: $theme-color-gold;
      text-decoration: none;
    }
  }
}
</style>
