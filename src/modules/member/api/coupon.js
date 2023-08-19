import request from '@/utils/request'
import qs from 'qs'

// 获取卡券列表
export function findCouponList(pageNum, pageSize, form) {
  return request({
    url: '/member/coupon/list_re',
    method: 'get',
    params: {
      pageSize: pageSize,
      pageNumber: pageNum,
      name: form.name,
      actStatus: form.actStatus
    }
  })
}

// 修改库存
export function modifyCouponStock(id, num) {
  return request({
    url: '/member/coupon/update',
    method: 'post',
    data: qs.stringify({
      id: id,
      totalInventory: num,
    })
  })
}

// 提前结束
export function overCoupon(id, interrupt, status) {
  return request({
    url: '/member/coupon/update',
    method: 'post',
    data: qs.stringify({
      id: id,
      interrupt: interrupt,
      actStatus: status,
    })
  })
}

// // 删除
// export function deleteCoupon(id) {
//   return request({
//     url: '/member/coupon/delete',
//     method: 'post',
//     data: qs.stringify({
//       ids: id
//     })
//   })
// }
// 删除
export function deleteCoupon(id) {
  return request({
    url: '/member/coupon/logical_del',
    method: 'post',
    data: qs.stringify({
      ids: id
    })
  })
}

// 获取卡券详情
export function findCouponItem(id) {
  return request({
    url: '/member/coupon/find_one',
    method: 'get',
    params: {
      id: id
    }
  })
}

//获取二维码
export function getQrCode(id) {
  return request({
    url: '/member/coupon/get_image',
    method: 'get',
    params: {
      couponId: id
    }
  })
}

export function getCouponAnalysis(name) {
  return request({
    url: '/member/coupon/analysis',
    method: 'get',
    params: {
      name: name
    }
  })
}

//获取门店 ------
export function findStoreList(id, name) {
  return request({
    url: '/member/coupon/store_select',
    method: 'get',
    params: {
      id: id,
      name: name
    }
  })
}

//获取卡券 ------
export function findCouponNameList() {
  return request({
    url: '/member/coupon/find_names',
    method: 'get',
    params: {
    }
  })
}
