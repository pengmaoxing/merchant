import request from '@/utils/request'
import qs from 'qs'


// 获取支付状态选项
export function findOrderStatusOption () {
  return request({
    url: '/order/order/find_order_status',
    method: 'get',
    params: {}
  })
}

// 获取支付方式
export function findOrderPayWayOption () {
  return request({
    url: '/order/order/find_pay_way',
    method: 'get',
    params: {}
  })
}

// 找出所有门店的列表（选项用）
export function findStoreOption () {
  return request({
    url: '/merchant/store/find_by_merchant_id',
    method: 'get',
    params: {}
  })
}
