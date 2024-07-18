import { IList, IPaging, ISettings } from '@/interface';
import request from '@/utils/request';

export function fetchSettingsList(params: IList<ISettings>) {
  return request.get<IPaging<ISettings>>('/settings/list', { params });
}
