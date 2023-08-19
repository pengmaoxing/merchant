import request from '@/utils/request'
import qs from 'qs'
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

//获取消费记录
export function findRecordList (pageNum, pageSize, form) {
  return request({
    url: '/member/stored_recored/find_by_merchant_id',
    method: 'get',
    params: {
      pageSize: pageSize,
      pageNumber: pageNum,
      phone: form.number,
      cashier: form.cashier,
      start_createTime: form.startTime,
      end_createTime: form.endTime,
      tradeType: form.payWay,
      storeId:form.storeId
    }
  })
}
