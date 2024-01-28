import { ISignin } from '@/interface';
import request from '@/utils/request';

export function fetchCreateSignin(data: ISignin) {
  return request.post('/signin/create', data);
}
export function fetchTodayIsSignin({ liveRoomId }) {
  return request.get('/signin/today_is_signin', {
    params: {
      live_room_id: liveRoomId,
    },
  });
}
