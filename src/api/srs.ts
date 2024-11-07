import request from '@/utils/request';

export function fetchRtcV1Publish(data: { sdp: string; streamurl: string }) {
  return request.post(`/srs/rtcV1Publish`, data);
}

export function fetchRtcV1Play(data: { sdp: string; streamurl: string }) {
  return request.post(`/srs/rtcV1Play`, data);
}

export function fetchRtcV1Whep(data: {
  app: string;
  stream: string;
  sdp: string;
}) {
  return request.post(`/srs/rtcV1Whep`, data);
}
