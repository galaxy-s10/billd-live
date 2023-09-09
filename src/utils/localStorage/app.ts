import { LOCALSTORAGE_KEY } from '@/constant';
import cache from '@/utils/cache';

export const getLastBuildDateByLs = () => {
  return cache.getStorage(LOCALSTORAGE_KEY.lastBuildDate);
};
export const setLastBuildDateByLs = (val: string) => {
  return cache.setStorage(LOCALSTORAGE_KEY.lastBuildDate, val);
};
