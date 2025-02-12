import { ILive, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchLiveList(params) {
  return request.get<IPaging<ILive>>('/live/list', {
    params,
  });
}

export function fetchLiveRoomOnlineUser(liveRoomId: number) {
  return request.get(`/live/live_room_online_user/${liveRoomId}`);
}

export function fetchLiveLiveRoomIsLive(liveRoomId: number) {
  return request.get<ILive | null>(`/live/live_room_is_live/${liveRoomId}`);
}

export function fetchLiveCloseMyLive() {
  return request.post(`/live/close_my_live`);
}
