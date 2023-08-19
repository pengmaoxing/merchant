import request from '@/utils/request'
import qs from 'qs'

//获取
export function getMemCardDetail() {
  return request({
    url: '/member/member_card/detail',
    method: 'get',
    params: {}
  })
}

//更新
export function saveMemCardDetail(data) {
  return request({
    url: '/member/member_card/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

//检查是否有卡券
export function findBindCardCoupon() {
  return request({
    url: '/member/coupon/find_type_coupon',
    method: 'get',
    params: {
      type: 2
    }
  })
}


// 删除绑定卡券
export function deleteCoupon(id) {
  return request({
    url: '/member/coupon/delete',
    method: 'post',
    data: qs.stringify({
      ids: id
    })
  })
}

export function getMerchantDetail(merchantId) {
  return request({
    url: '/merchant/admin/show_photo',
    method: 'get',
    params: {}
  })
}


export function getAliMemberDetail() {
  return request({
    url: '/member/ali_member/find_by_merchantId',
    method: 'get',
    params: {}
  })
}

export function saveAliMember() {
  return request({
    url: '/member/ali_member/save_rewrite',
    method: 'post',
    data:qs.stringify(
    )
  })
}

