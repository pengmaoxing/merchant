import request from '@/utils/request'
import qs from 'qs'
// 获取角色列表
export function getRole (pageNumber, pageSize) {
  return request({
    url: '/merchant/role/list',
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}
// 设置默认角色
export function setDefault (id, isDefault) {
  return request({
    url: '/merchant/role/setDefault',
    method: 'post',
    data: qs.stringify({
      id,
      isDefault
    })
  })
}
// 添加角色
export function addRole (name, defaultRole) {
  return request({
    url: '/merchant/role/save',
    method: 'post',
    data: qs.stringify({
      name,
      defaultRole
    })
  })
}
// 删除角色
export function deleteRoles (ids) {
  return request({
    url: '/merchant/role/delete',
    method: 'post',
    data: qs.stringify({
      'ids': ids
    }, { indices: false }) // indices: false将数组转化为后台能接受的格式
  })
}
// 编辑角色
export function editRole (id, name) {
  return request({
    url: '/merchant/role/update',
    method: 'post',
    data: qs.stringify({
      id,
      name
    })
  })
}
// 分配角色权限
export function setPermission (id, permIds) {
  return request({
    url: '/merchant/role/edit_role_perm',
    method: 'post',
    data: qs.stringify({
      id,
      permIds
    }, { indices: false })
  })
}
// 角色下拉菜单
export function selectRole () {
  return request({
    url: '/merchant/role/select_item',
    method: 'get'
  })
}
