import { IGlobalMsg, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchGlobalMsgList(params) {
  return request.get('/global_msg/list', {
    params,
  });
}

export function fetchGlobalMsgMyList(params) {
  return request.get<IPaging<IGlobalMsg>>('/global_msg/my_list', {
    params,
  });
}
export function fetchGlobalMsgCreate(data) {
  return request.post('/global_msg/create', data);
}
