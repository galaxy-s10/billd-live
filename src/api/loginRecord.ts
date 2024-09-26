import { ILoginRecord, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchloginRecordList(params) {
  return request.get<IPaging<ILoginRecord>>('/login_record/list', {
    params,
  });
}
