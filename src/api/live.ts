import request from '@/utils/request';

export function fetchLiveList(params) {
  return request.instance({
    url: '/live/list',
    method: 'get',
    params,
  });
}
