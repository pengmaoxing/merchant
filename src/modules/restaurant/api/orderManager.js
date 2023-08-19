import request from '@/utils/request'
import qs from 'qs'

// 获取后台订单的列表
export function
getOrderList(pageNumber, pageSize, queryList, start_createTime, end_createTime) {
  return request({
    url: '/repast/repast_order/list_rewrite',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      orderNumber: queryList.orderNumber,
      repastWay:queryList.repastWay||'',
      start_createTime: start_createTime,
      end_createTime: end_createTime
    }
  })
}

//查看后台订单详情
export function getOrderDetail(orderId) {
  return request({
    url: '/repast/repast_order/repast_order_detail',
    method: 'get',
    params: {
      orderId: orderId,
    }
  })
}

//退款操作 同意退款
export function verifyRefund(form) {
  return request({
    url: '/repast/repast_order/refund_agree',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

//退款操作 拒绝退款
export function rejectRefund(orderId) {
  return request({
    url: '/repast/repast_order/refund_dis_agree',
    method: 'post',
    data: qs.stringify({
      orderId: orderId,
    })
  })
}

