import { ILiveRecord, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchLiveRecordMyList(params) {
  return request.get<IPaging<ILiveRecord>>('/live_record/my_list', {
    params,
  });
}

export function fetchLiveRecordRecentlyLive(userId: number) {
  return request.get<ILiveRecord>(`/live_record/recently_live/${userId}`);
}
