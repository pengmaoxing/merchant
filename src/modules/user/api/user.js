import request from '@/utils/request'
import qs from 'qs'

// 获取用户列表
export function getUser (pageNumber, pageSize, queryList) {
  return request({
    url: '/merchant/user/list_rewrite',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      name: queryList.name,
      phone: queryList.phone,
    }
  })
}

// 添加用户
export function addUser (userInfo) {
  return request({
    url: '/merchant/user/save_user',
    method: 'post',
    data: qs.stringify(
      userInfo
    )
  })
}

// 修改用户信息
export function editUser (userInfo) {
  return request({
    url: '/merchant/user/update_user',
    method: 'post',
    data: qs.stringify(
      userInfo
    )
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

// 获取商户门店列表
export function storeListByMctId (id) {
  return request({
    url: '/merchant/store/find_by_merchant_id',
    method: 'get',
    params: {
      id: id,
    }
  })
}

// 查看用户详情
export function userDetail (id) {
  return request({
    url: '/merchant/user/detail',
    method: 'get',
    params: {
      id: id,
    }
  })
}

// 修改密码
export function updatePwd (oldPassword, newPassword) {
  return request({
    url: '/merchant/user/modify_password',
    method: 'post',
    params: {
      password: oldPassword,
      newPassword: newPassword,
    }
  })
}


