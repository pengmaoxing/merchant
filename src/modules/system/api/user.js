import request from '@/utils/request'
import qs from 'qs'

// 获取角色列表
export function getUser (pageNumber, pageSize, queryList) {
  return request({
    url: '/merchant/user/list',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      name: queryList.name,
      phone: queryList.phone,
      email: queryList.email
    }
  })
}

// 禁用用户
export function disableUser (id) {
  return request({
    url: '/merchant/user/disable',
    method: 'post',
    data: qs.stringify({
      id
    })
  })
}

// 启用用户
export function enableUser (id) {
  return request({
    url: '/merchant/user/enable',
    method: 'post',
    data: qs.stringify({
      id
    })
  })
}

// 添加用户
export function addUser (userInfo) {
  return request({
    url: '/merchant/user/save_user',
    method: 'post',
    data: qs.stringify({
      username: userInfo.username,
      password: userInfo.password,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      roleIds: userInfo.roles
    }, { indices: false })
  })
}

// 修改用户信息
export function editUser (userInfo) {
  return request({
    url: '/merchant/user/update_user',
    method: 'post',
    data: qs.stringify({
      id: userInfo.id,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      roleIds: userInfo.roles
    }, { indices: false })
  })
}

// 重置密码
export function resetPassword (id, password) {
  return request({
    url: '/merchant/user/reset_password',
    method: 'post',
    data: qs.stringify({
      id,
      password
    })
  })
}
