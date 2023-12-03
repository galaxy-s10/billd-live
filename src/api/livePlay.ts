import request from '@/utils/request';

export function fetchLivePlayList(params: {
  orderName: string;
  orderBy: string;
  nowPage?: number;
  pageSize?: number;
}) {
  return request.instance({
    url: '/live_play/list',
    method: 'get',
    params,
  });
}
