import request from '@/utils/request'
import qs from 'qs'



// 获取门店列表
export function findStoreList (pageNum, pageSize, payWay, status, start_payTime, end_payTime) {
  return request({
    url: '/order/running_account/merchant_running_account_list_for_store_order',
    method: 'get',
    params: {
      pageSize,
      pageNum,
      payWay,
      status,
      start_payTime,
      end_payTime
    }
  })
}




