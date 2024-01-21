import request from '@/utils/request';

export function fetchLiveRoomList(params) {
  return request.instance({
    url: '/live_room/list',
    method: 'get',
    params,
  });
}

export function fetchVerifyPkKey(data: { liveRoomId: number; key }) {
  return request.get(`/live_room/verify_pk_key/${data.liveRoomId}`, {
    params: { key: data.key },
  });
}
export function fetchUpdateLiveRoomKey() {
  return request.instance({
    url: '/live_room/update_key',
    method: 'put',
  });
}

export function fetchFindLiveRoom(roomId: string) {
  return request.instance({
    url: `/live_room/find/${roomId}`,
    method: 'get',
  });
}
