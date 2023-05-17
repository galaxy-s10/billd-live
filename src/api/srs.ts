import request from '@/utils/request';

export function fetchRtcV1Publish(data: {
  api: string;
  clientip: string | null;
  sdp: string;
  streamurl: string;
  tid: string;
}) {
  return request.instance({
    baseURL: '/srs',
    url: `/rtc/v1/publish/`,
    method: 'post',
    data,
  });
}
export function fetchRtcV1Play(data: {
  api: string;
  clientip: string | null;
  sdp: string;
  streamurl: string;
  tid: string;
}) {
  return request.instance({
    baseURL: '/srs',
    url: '/rtc/v1/play/',
    method: 'post',
    data,
  });
}
