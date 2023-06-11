import request from '@/utils/request';

/**
 * 获取后端信息
 */
export function fetchServerInfo() {
  return request.instance({
    url: '/other/server_info',
    method: 'get',
  });
}
