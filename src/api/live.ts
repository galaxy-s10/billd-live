import request from '@/utils/request';

export function fetchLiveList() {
  return request.instance({
    url:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4300/live/list'
        : 'https://live.hsslive.cn/api/live/list',
    method: 'get',
  });
}
