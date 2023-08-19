import request from '@/utils/request'
import qs from 'qs'
//获取列表

export function getOrderList(pageNumber,pageSize,merchantId,start_createTime,end_createTime) {
  return request({
    url: '/gas/info/list',
    method: 'get',
    params: {
      merchantId: merchantId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      start_createTime: start_createTime,
      end_createTime: end_createTime,
    }
  })
}

// 获取油价
export function getGasPrice(id) {
  return request({
    url: '/gas/price/find_one',
    method: 'get',
    params: {
      merchantId: id
    }
  })
}
// 保存油价
export function saveGasPrice(form) {
  return request({
    url: '/gas/price/save',
    method: 'post',
    data:qs.stringify(
      form
    )
  })
}
