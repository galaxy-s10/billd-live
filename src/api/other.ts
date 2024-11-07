import { ICredential } from '@/interface';
import request from '@/utils/request';

/**
 * 获取后端信息
 */
export function fetchServerInfo() {
  return request.get('/other/server_info');
}

export function fetchGetPolicyByRes({ prefix }) {
  return request.get<{ err; credential: ICredential }>(
    '/other/get_policy_by_res',
    {
      params: { prefix },
    }
  );
}
