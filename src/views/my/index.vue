<template>
  <div class="my-wrap">
    <div class="id">用户id：{{ userStore.userInfo?.id }}</div>
    <div class="avatar">
      <span class="txt">用户头像：</span>
      <Avatar
        :avatar="userStore.userInfo?.avatar"
        :size="30"
        :border="!userStore.userInfo?.avatar?.length"
      ></Avatar>
    </div>
    <div class="username">用户昵称：{{ userStore.userInfo?.username }}</div>
    <div class="username">
      用户角色：{{
        userStore.userInfo?.roles?.map((item) => item.role_name).join(',')
      }}
    </div>
    <br />
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
          直播间地址：
          <a
            :href="getLiveRoomPageUrl(userStore.userInfo?.live_rooms?.[0]?.id!)"
            class="link"
            target="_blank"
          >
            {{ getLiveRoomPageUrl(userStore.userInfo?.live_rooms?.[0]?.id!) }}
          </a>
        </div>
        <div>直播间名称：{{ userStore.userInfo?.live_rooms?.[0]?.name }}</div>
        <div>
          直播间简介：{{
            userStore.userInfo?.live_rooms?.[0]?.desc || '暂无简介'
          }}
        </div>
        <div>
          直播间分区：{{
            userStore.userInfo?.live_rooms?.[0]?.areas?.[0]?.name || '暂无分区'
          }}
        </div>
        <div
          v-if="
            userStore.userInfo?.auths?.find(
              (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PUSH.auth_value
            )
          "
          class="url-wrap"
          v-loading="updateKeyLoading"
        >
          <div
            class="link"
            @click="handleUpdateKey"
          >
            更新地址
          </div>
          <div
            class="cdn"
            v-if="
              userStore.userInfo?.auths?.find(
                (v) =>
                  v.auth_value === DEFAULT_AUTH_INFO.LIVE_PULL_SVIP.auth_value
              )
            "
          >
            <div>
              <span>
                RTMP推流地址（CDN）：{{
                  userStore.userInfo?.live_rooms?.[0]?.cdn_push_rtmp_url!
                }}，
              </span>
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.cdn_push_rtmp_url!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span>
                OBS服务器（CDN）：{{
                  userStore.userInfo?.live_rooms?.[0]?.cdn_push_obs_server!
                }}，
              </span>
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.cdn_push_obs_server!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span>
                OBS推流码（CDN）：{{
                  userStore.userInfo?.live_rooms?.[0]?.cdn_push_obs_stream_key!
                }}，
              </span>
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]
                      ?.cdn_push_obs_stream_key!
                  )
                "
              >
                复制
              </span>
            </div>
          </div>

          <div class="srs">
            <div>
              <span>
                RTMP推流地址：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_rtmp_url!
                }}，
              </span>
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_rtmp_url!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span
                >OBS服务器：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_obs_server!
                }}，</span
              >
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_obs_server!
                  )
                "
              >
                复制
              </span>
            </div>
            <div>
              <span
                >OBS推流码：{{
                  userStore.userInfo?.live_rooms?.[0]?.push_obs_stream_key!
                }}，</span
              >
              <span
                class="link"
                @click="
                  handleCopy(
                    userStore.userInfo?.live_rooms?.[0]?.push_obs_stream_key!
                  )
                "
              >
                复制
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard, openToTarget } from 'billd-utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { fetchUpdateLiveRoomKey } from '@/api/liveRoom';
import { DEFAULT_AUTH_INFO } from '@/constant';
import { loginTip } from '@/hooks/use-login';
import { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { getLiveRoomPageUrl } from '@/utils';

const userStore = useUserStore();
const router = useRouter();

const updateKeyLoading = ref(false);

function handleCopy(url: string) {
  copyToClipBoard(url);
  window.$message.success('复制成功！');
}

function openLiveRoom() {
  if (!loginTip()) {
    return;
  }
  const url = router.resolve({
    name: routerName.push,
    query: { liveType: LiveRoomTypeEnum.srs },
  });
  openToTarget(url.href);
}

async function handleUpdateKey() {
  try {
    updateKeyLoading.value = true;
    const res = await fetchUpdateLiveRoomKey();
    if (res.code === 200 && userStore.userInfo?.live_rooms?.[0]) {
      userStore.userInfo.live_rooms[0].push_obs_server =
        res.data.srsPushRes.push_obs_server;
      userStore.userInfo.live_rooms[0].push_obs_stream_key =
        res.data.srsPushRes.push_obs_stream_key;
      userStore.userInfo.live_rooms[0].push_rtmp_url =
        res.data.srsPushRes.push_rtmp_url;
      userStore.userInfo.live_rooms[0].push_srt_url =
        res.data.srsPushRes.push_srt_url;
      userStore.userInfo.live_rooms[0].push_webrtc_url =
        res.data.srsPushRes.push_webrtc_url;
      userStore.userInfo.live_rooms[0].cdn_push_obs_server =
        res.data.srsPushRes.push_obs_server;
      userStore.userInfo.live_rooms[0].cdn_push_obs_stream_key =
        res.data.cdnPushRes.push_obs_stream_key;
      userStore.userInfo.live_rooms[0].cdn_push_rtmp_url =
        res.data.cdnPushRes.push_rtmp_url;
      userStore.userInfo.live_rooms[0].cdn_push_srt_url =
        res.data.cdnPushRes.push_srt_url;
      userStore.userInfo.live_rooms[0].cdn_push_webrtc_url =
        res.data.cdnPushRes.push_webrtc_url;
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateKeyLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.my-wrap {
  position: relative;
  padding: 10px;
  .link {
    color: $theme-color-gold;
    text-decoration: none;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    align-items: center;
    .txt {
      margin-right: 10px;
    }
  }
  .url-wrap {
    position: relative;
    margin-top: 10px;
    .cdn {
      margin-bottom: 10px;
    }
  }
}
</style>
