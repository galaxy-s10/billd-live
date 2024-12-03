import { IGlobalMsg, IList, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchGlobalMsgMyList(params: IList<IGlobalMsg>) {
  return request.get<IPaging<IGlobalMsg>>('/global_msg/my_list', {
    params,
  });
}
