import { IBlacklist } from '@/interface';
import request from '@/utils/request';

export function fetchBlacklistAddAdminDisable(data: IBlacklist) {
  return request.post('/blacklist/add_admin_disable', data);
}

export function fetchBlacklistAddDisableMsg(data: IBlacklist) {
  return request.post('/blacklist/add_disable_msg', data);
}

export function fetchBlacklistDelDisableMsg(data: IBlacklist) {
  return request.post('/blacklist/del_disable_msg', data);
}

export function fetchBlacklistDelAdminDisable(data: IBlacklist) {
  return request.post('/blacklist/del_admin_disable', data);
}

export function fetchBlacklistList(params) {
  return request.instance({
    url: '/blacklist/list',
    method: 'get',
    params,
  });
}

export function fetchCreateBlacklist(data: IBlacklist) {
  return request.instance({
    url: '/blacklist/create',
    method: 'post',
    data,
  });
}

export function fetchUpdateBlacklist(data: IBlacklist) {
  return request.instance({
    url: `/blacklist/update/${data.id!}`,
    method: 'put',
    data,
  });
}
export function fetchDeleteBlacklist(id: number) {
  return request.instance({
    url: `/blacklist/delete/${id}`,
    method: 'delete',
  });
}
