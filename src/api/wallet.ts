import request from '@/utils/request';

export function fetchWalletList() {
  return request.instance({
    url: '/wallet/list',
    method: 'get',
  });
}
