import request from '@/utils/request';

export function fetchTencentcloudCssPush(liveRoomId: number) {
  return request.post<{
    push_rtmp_url: string;
    push_obs_server: string;
    push_obs_stream_key: string;
    push_webrtc_url: string;
    push_srt_url: string;
  }>(`/tencentcloud_css/push`, { liveRoomId });
}
