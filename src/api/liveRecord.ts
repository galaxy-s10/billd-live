import { ILiveRecord, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchLiveRecordMyList(params) {
  return request.get<IPaging<ILiveRecord>>('/live_record/my_list', {
    params,
  });
}
