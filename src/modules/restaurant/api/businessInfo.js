import request from '@/utils/request'
import qs from 'qs'

// 获取统计数据
export function getBusinessTotal(start_createTime, end_createTime) {
  return request({
    url: '/repast/order_report/business_summary',
    method: 'get',
    params: {
      start_createTime: start_createTime,
      end_createTime: end_createTime
    }
  })
}
// 获取营业列表
export function getBusinessList(pageNumber, pageSize,start_createTime, end_createTime) {
  return request({
    url: '/repast/order_report/business_record',
    method: 'get',
    params: {
      pageNumber:pageNumber,
      pageSize:pageSize,
      start_createTime: start_createTime,
      end_createTime: end_createTime
    }
  })
}
