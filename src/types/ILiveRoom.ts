import { IArea, ILive, SwitchEnum } from '@/interface';
import { IUser } from '@/types/IUser';

/** 直播间类型 */
export enum LiveRoomTypeEnum {
  /** 系统推流 */
  system,
  /** 主播使用srs推流 */
  srs,
  /** 主播使用obs/ffmpeg推流 */
  obs,
  /** 主播使用webrtc推流，直播 */
  wertc_live,
  /** 主播使用webrtc推流，会议，实现一 */
  wertc_meeting_one,
  /** 主播使用webrtc推流，会议，实现二 */
  wertc_meeting_two,
  /** 主播使用msr推流 */
  msr,
  /** 主播打pk */
  pk,
  /** 主播使用腾讯云css推流 */
  tencent_css,
  /** 主播使用腾讯云css推流打pk */
  tencent_css_pk,
  /** 转推b站 */
  forward_bilibili,
  /** 转推虎牙 */
  forward_huya,
  /** 转推斗鱼 */
  forward_douyu,
  /** 转推抖音 */
  forward_douyin,
  /** 转推抖音 */
  forward_kuaishou,
  /** 转推小红书 */
  forward_xiaohongshu,
  /** 转推所有 */
  forward_all,
}

/** 拉流是否需要鉴权 */
export enum LiveRoomPullIsShouldAuthEnum {
  /** 需要鉴权 */
  yes,
  /** 不需要鉴权 */
  no,
}

/** 直播间状态 */
export enum LiveRoomStatusEnum {
  /** 正常 */
  normal,
  /** 禁用 */
  disable,
}

/** 提醒游客登录 */
export enum LiveRoomTipTouristLoginEnum {
  /** 关闭，即不提醒游客登录 */
  close,
  /** 开启提醒游客登录，游客可关闭 */
  open,
  /** 强制游客登录，即游客不可关闭 */
  force,
}

export interface ILiveRoom {
  id?: number;
  /** 直播间名称 */
  name?: string;
  /** 直播间简介 */
  desc?: string;
  /** 是否使用cdn */
  cdn?: SwitchEnum;
  /** 权重 */
  priority?: number;
  /** 推流秘钥 */
  key?: string;
  /** 直播间类型 */
  type?: LiveRoomTypeEnum;
  /** 开播预览图 */
  cover_img?: string;
  /** 直播间背景图 */
  bg_img?: string;
  /** 直播间状态 */
  status?: LiveRoomStatusEnum;
  /** 直播间是否显示 */
  is_show?: SwitchEnum;
  /** 直播间是否开启聊天 */
  open_chat?: SwitchEnum;
  /** 提醒游客登录 */
  tip_tourist_login?: LiveRoomTipTouristLoginEnum;
  /** 提醒游客登录间隔 */
  tip_tourist_login_delay?: number;
  /** 游客能否发言 */
  tourist_send_msg?: SwitchEnum;
  /** 聊天关键词过滤 */
  keyword_filter_msg?: string;
  /** 用户名关键词过滤 */
  keyword_filter_username?: string;
  /** 历史消息条数 */
  history_msg_total?: number;
  /** 新注册用户不能发言时间(秒) */
  newuser_send_msg_delay?: number;
  /** 房间密码 */
  room_pwd?: string;
  /** 关闭房间 */
  is_close?: SwitchEnum;
  /** 关闭房间描述 */
  is_close_desc?: string;
  /** 发送消息间隔(秒) */
  send_msg_throttle?: number;
  /** 是否开启签到 */
  is_show_signin?: SwitchEnum;
  /** 是否开启手机看直播 */
  is_show_phone_live?: SwitchEnum;
  /** 公告 */
  announcement_msg?: string;
  /** 通知 */
  notice_msg?: string;
  /** 系统消息 */
  system_msg?: string;
  /** 显示直播间在线人数 */
  is_show_live_user_nums?: SwitchEnum;
  /** 设置直播间最低在线人数 */
  mock_live_user_nums_min?: number;
  /** 设置直播间最高在线人数 */
  mock_live_user_nums_max?: number;
  /** 直播间最在线人数刷新间隔 */
  mock_live_user_nums_refresh_delay?: number;
  /** 聊天消息审核 */
  msg_verify?: SwitchEnum;

  pull_rtmp_url?: string;
  pull_flv_url?: string;
  pull_hls_url?: string;
  pull_webrtc_url?: string;

  pull_cdn_rtmp_url?: string;
  pull_cdn_flv_url?: string;
  pull_cdn_hls_url?: string;
  pull_cdn_webrtc_url?: string;

  push_rtmp_url?: string;
  push_obs_server?: string;
  push_obs_stream_key?: string;
  push_webrtc_url?: string;
  push_srt_url?: string;

  push_cdn_rtmp_url?: string;
  push_cdn_obs_server?: string;
  push_cdn_obs_stream_key?: string;
  push_cdn_webrtc_url?: string;
  push_cdn_srt_url?: string;

  forward_bilibili_url?: string;
  forward_douyu_url?: string;
  forward_huya_url?: string;
  forward_douyin_url?: string;
  forward_kuaishou_url?: string;
  forward_xiaohongshu_url?: string;

  /** 直播间备注 */
  remark?: string;

  /** 用户信息 */
  user?: IUser;
  /** 用户信息 */
  users?: IUser[];
  /** 分区信息 */
  area?: IArea;
  /** 分区信息 */
  areas?: IArea[];
  /** 直播信息 */
  live?: ILive;

  is_fake?: SwitchEnum;

  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
