import request from '@/utils/request';

export function fetchLiveList(params: { orderName: string; orderBy: string }) {
  return request.instance({
    url: '/api/live/list',
    method: 'get',
    params,
  });
}
