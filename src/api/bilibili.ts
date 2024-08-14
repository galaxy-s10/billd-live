import request from '@/utils/request';

export function fetchLiveBilibiliGetUserRecommend(params: {
  page;
  page_size;
  platform;
}) {
  // return request.get(
  //   'https://live-api.hsslive.cn/apilivebilibilicom/xlive/web-interface/v1/second/getUserRecommend',
  //   {
  //     params,
  //   }
  // );
  return request.get('/bilibili/api_live_bilibili_com_get', {
    params: {
      url: 'xlive/web-interface/v1/second/getUserRecommend',
      ...params,
    },
  });
}

export function fetchLiveBilibiliPlayUrl(params: { cid; platform }) {
  return request.get('/bilibili/api_live_bilibili_com_get', {
    params: {
      url: 'room/v1/Room/playUrl',
      ...params,
    },
  });
}
export function fetchLiveBilibiliRoomGetInfo(params: { room_id }) {
  return request.get('/bilibili/api_live_bilibili_com_get', {
    params: {
      url: 'room/v1/Room/get_info',
      ...params,
    },
  });
}
