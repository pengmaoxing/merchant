import request from '@/utils/request'
import qs from 'qs'

// 获取门店列表
export function findStoreList (name) {
  return request({
    url: '/merchant/store/find_stores',
    method: 'get',
    params: {
      name: name,
      status: 1,
      pageSize:100000
    }
  })
}

// 保存
export function saveCoupon (data) {
  return request({
    url: '/member/coupon/save_re',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 保存
export function saveCouponByType (data) {
  return request({
    url: '/member/coupon/save_type_coupon',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

//获取卡券详情回显

export function findSignCouponDetail (id) {
  return request({
    url: '/member/coupon/find_one',
    method: 'get',
    params: {
      id: id
    }
  })
}

//检查名称
export function checkCouponName (name) {
  return request({
    url: '/member/coupon/check_name',
    method: 'get',
    params: {
      couponName: name
    }
  })
}
