import request from '@/utils/request';

export function fetchLiveList(params: {
  orderName: string;
  orderBy: string;
  nowPage?: number;
  pageSize?: number;
}) {
  return request.instance({
    url: '/live/list',
    method: 'get',
    params,
  });
}
