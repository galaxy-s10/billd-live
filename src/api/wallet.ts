import { IWallet } from '@/interface';
import request from '@/utils/request';

export function fetchWalletList(params) {
  return request.get('/wallet/list', {
    params,
  });
}
export function fetchMyWallet() {
  return request.get<IWallet>('/wallet/my_wallet');
}
