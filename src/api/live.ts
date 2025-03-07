import { ILive, IPaging } from '@/interface';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchLiveList(params) {
  return request.get<IPaging<ILive>>('/live/list', {
    params,
  });
}

export function fetchLiveRoomOnlineUser(liveRoomId: number) {
  return request.get(`/live/live_room_online_user/${liveRoomId}`);
}

export function fetchLiveRoomOnlineUserCount(liveRoomId: number) {
  return request.get(`/live/live_room_online_user_count/${liveRoomId}`);
}

export function fetchLiveLiveRoomIsLive(liveRoomId: number) {
  return request.get<ILive | null>(`/live/live_room_is_live/${liveRoomId}`);
}

export function fetchLiveStartLive(data: {
  live_room_type: LiveRoomTypeEnum;
  area_id?: number;
  area_name?: string;
}) {
  return request.post(`/live/start_live`, data);
}

export function fetchLiveCloseMyLive() {
  return request.post(`/live/close_my_live`);
}
