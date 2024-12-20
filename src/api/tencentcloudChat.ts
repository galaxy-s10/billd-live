import request from '@/utils/request';

export function fetchTencentcloudChatGenUserSig(userId: string) {
  return request.post(`/tencentcloud_chat/gen_user_sig`, { userId });
}
