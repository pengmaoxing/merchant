import request from '@/utils/request'
import qs from 'qs'

// 根据用户名查询手机号码
export function phoneFindByUsername (username) {
  return request({
    url: '/merchant/admin/phone_find_by_username',
    method: 'get',
    params: {
      username: username,
    }
  })
}

// 发送手机验证码
export function sendSms (phone) {
  return request({
    url: '/merchant/admin/send_sms',
    method: 'post',
    params: {
      phone: phone,
    }
  })
}

// 校验手机号码
export function verifyCode (phone,code) {
  return request({
    url: '/merchant/admin/verify_code',
    method: 'post',
    params: {
      phone: phone,
      code: code,
    }
  })
}

// 设置新密码
export function resetNewPwd (username,password) {
  return request({
    url: '/merchant/admin/reset_new_pwd',
    method: 'post',
    params: {
      username: username,
      password: password,
    }
  })
}
