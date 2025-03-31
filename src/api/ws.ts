import request from '@/utils/request';

export function fetchWsKeepJoined(data) {
  return request.post('/ws/keep_joined', data);
}

export function fetchWsJoin(data) {
  return request.post('/ws/join', data);
}

export function fetchWsSendMsg(data) {
  return request.post('/ws/send_msg', data);
}

export function fetchWsGetWsInfo() {
  return request.get('/ws/get_ws_info');
}
