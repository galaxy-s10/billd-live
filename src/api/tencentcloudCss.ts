import { IStreamKey } from '@/interface';
import request from '@/utils/request';

export function fetchTencentcloudCssPush(liveRoomId: number) {
  return request.post<IStreamKey>(`/tencentcloud_css/push`, { liveRoomId });
}
