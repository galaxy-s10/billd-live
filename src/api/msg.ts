import { IList, IMsg, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchMsgList(params: IList<IMsg>) {
  return request.get<IPaging<IMsg>>('/msg/list', {
    params,
  });
}

export function fetchMsgSend(data) {
  return request.post('/msg/send', data);
}
