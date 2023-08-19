import request from '@/utils/request'
import qs from 'qs'

// 获取订单详情
export function findOrderDetail (orderNumber) {
  return request({
    url: '/order/management/pc/order_detail',
    method: 'get',
    params: {
      orderNumber: orderNumber
    }
  })
}

//退款

export function refund (data) {
  return request({
    url: 'order/management/pc/refund',
    method: 'post',
    data: qs.stringify({
      orderNumber: data.id,
      refundPayPrice: data.actualPrice,
      password: data.refundPw
    })
  })
}



