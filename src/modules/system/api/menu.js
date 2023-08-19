import request from '@/utils/request'

export function getMenu () {
  return request({
    url: '/merchant/permission/findMenuList',
    method: 'get'
  })
}
