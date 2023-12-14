import request from '@/utils/request';

export function fetchAreaList() {
  return request.instance({
    url: '/area/list',
    method: 'get',
  });
}
export function fetchAreaLiveRoomList(params) {
  return request.instance({
    url: '/area/area_live_room_list',
    method: 'get',
    params,
  });
}

export function fetchLiveRoomList(params) {
  return request.instance({
    url: '/area/live_room_list',
    method: 'get',
    params,
  });
}
