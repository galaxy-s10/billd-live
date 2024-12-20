import request from '@/utils/request';

export function fetchTencentcloudCosGetPolicyByRes(prefix: string) {
  return request.get(`/tencentcloud_cos/policy_by_res`, {
    params: { prefix },
  });
}
