import request from '@/utils/request'
import qs from 'qs'

// 登录
export function login (username, password) {
  // 返回一个Promise对象
  return request({
    url: '/merchant/admin/login',
    method: 'post',
    data: qs.stringify({
      username: username,
      password: password
    })
  })
}

// 获取网站信息
export function getSiteInfo() {
  return request({
    url: '/auth/admin/get_siteinfo',
    method: 'get',
    params: {}
  })
}



