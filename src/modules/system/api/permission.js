import request from '@/utils/request'
import qs from 'qs'

// 获取所有权限
export function getAllPermission () {
  return request({
    url: '/merchant/permission/find_all_list',
    method: 'get'
  })
}

// 添加权限
export function addPermission (data) {
  return request({
    url: '/merchant/permission/save',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 删除权限
export function deletePermissions (ids) {
  return request({
    url: '/merchant/permission/delete',
    method: 'post',
    data: qs.stringify({
      ids
    }, { indices: false })
  })
}

// 编辑权限
export function editPermission (data) {
  return request({
    url: '/merchant/permission/update',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}
