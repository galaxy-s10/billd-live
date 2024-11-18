import { IGoods, IList, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchGoodsFind(id: number) {
  return request.get<IGoods>(`/goods/find/${id}`);
}

export function fetchGoodsList(params: IList<IGoods>) {
  return request.get<IPaging<IGoods>>('/goods/list', { params });
}

export function fetchFindByTypeGoods(type) {
  return request.get<IGoods>('/goods/find_by_type', {
    params: { type },
  });
}
