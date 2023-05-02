import request from '@/utils/request';

export function fetchLiveList() {
  return request.instance({
    url: '/api/live/list',
    method: 'get',
  });
}
