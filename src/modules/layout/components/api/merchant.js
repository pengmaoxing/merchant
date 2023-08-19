import request from '@/utils/request'
import qs from 'qs'

// 获取商户详情LOGO
export function getMerchantDetail (merchantId) {
  return request({
    url: '/merchant/admin/show_photo',
    method: 'get',
    params: {
    }
  })
}

//修改商户LOGO
export function editMerchant (photoId) {
  return request({
    url: '/merchant/merchant/update_photo ',
    method: 'post',
    data: qs.stringify({
      photoId: photoId
    })
  })
}

// 获取商户详情
export function detail () {
  return request({
    url: '/merchant/merchant/detail ',
    method: 'get',
    params: {
    }
  })
}
