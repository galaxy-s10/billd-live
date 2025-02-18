import request from '@/utils/request';

export function fetchWsKeepJoined(data) {
  return request.post('/ws/keep_joined', data);
}
