import request from '@/utils/request'
import qs from 'qs'

// 商户首页统计 卡片
export function getStatisticsData() {
  return request({
    url: '/order/admin/merchant_home_page_statistics/data_overview',
    method: 'get',
    params: {}
  })
}

// 获取订单类数据
export function getStatisticsOrder(type) {
  return request({
    url: '/order/admin/merchant_home_page_statistics/order_line_chart',
    method: 'get',
    params: {
      type: type
    }
  })
}

// 获取统计类数据
export function getStatisticsReceivables(type) {
  return request({
    url: '/order/admin/merchant_home_page_statistics/receivables_line_chart',
    method: 'get',
    params: {
      type: type
    }
  })
}




