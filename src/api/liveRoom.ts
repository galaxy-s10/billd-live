import request from '@/utils/request';

export function fetchLiveRoomList(params: {
  orderName: string;
  orderBy: string;
}) {
  return request.instance({
    url: '/live_room/list',
    method: 'get',
    params,
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
