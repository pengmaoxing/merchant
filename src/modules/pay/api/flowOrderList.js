import request from '@/utils/request'
import qs from 'qs'

// 获取订单列表
export function findOrderList(pageNum, pageSize, orderNumber, userName, storeId, payWay, status, start_payTime, end_payTime) {
  return request({
    url: '/order/running_account/merchant_running_account_list_for_store_order',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      orderNumber,
      userName,
      storeId:storeId || -1,
      payWay,
      status,
      start_payTime,
      end_payTime
    }
  })
}

// 获取订单列表excel
export function listExport(orderNumber, userName, storeId, payWay, status, start_payTime, end_payTime) {
  return request({
    url: '/order/running_account/merchant_running_account_list_for_store_export',
    method: 'get',
    responseType: 'blob',
    params: {
      orderNumber,
      userName,
      storeId:storeId || -1,
      payWay,
      status,
      start_payTime,
      end_payTime
    }
  })
}

//获取统计数据excel


export function totalExport(form) {
  return request({
    url: '/order/running_account/merchant_total_count_export',
    method: 'get',
    responseType: 'blob',
    params: form
  })
}




