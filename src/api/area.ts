import request from '@/utils/request';

export function fetchAreaLiveRoomList(params: {
  orderName: string;
  orderBy: string;
}) {
  return request.instance({
    url: '/area/area_live_room_list',
    method: 'get',
    params,
  });
}

export function fetchLiveRoomList(params: {
  pageSize?: string;
  nowPage?: string;
  id: number;
}) {
  return request.instance({
    url: '/area/live_room_list',
    method: 'get',
    params,
  });
}
