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
