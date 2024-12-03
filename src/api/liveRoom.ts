import { IList, IPaging, IPushRes } from '@/interface';
import { ILiveRoom } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchLiveRoomBilibili() {
  return request.get<ILiveRoom>('/live_room/bilibili');
}

export function fetchLiveRoomList(params: IList<ILiveRoom>) {
  return request.get<IPaging<ILiveRoom>>('/live_room/list', {
    params,
  });
}

export function fetchVerifyPkKey(data: { liveRoomId: number; key }) {
  return request.get(`/live_room/verify_pk_key/${data.liveRoomId}`, {
    params: { key: data.key },
  });
}

export function fetchUpdateLiveRoomKey() {
  return request.put<IPushRes>('/live_room/update_key');
}

export function fetchUpdateMyLiveRoom(data: ILiveRoom) {
  return request.put('/live_room/update_my_live_room', data);
}

export function fetchFindLiveRoom(roomId: number) {
  return request.get<ILiveRoom | null>(`/live_room/find/${roomId}`);
}
