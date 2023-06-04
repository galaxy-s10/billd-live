import request from '@/utils/request';

export function fetchWalletList(params) {
  return request.instance({
    url: '/wallet/list',
    method: 'get',
    params,
  });
}
