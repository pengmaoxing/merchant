import request from '@/utils/request'
import qs from 'qs'

// 获取支付状态选项
export function findOrderStatusOption() {
  return request({
    url: '/order/order/find_order_status',
    method: 'get',
    params: {}
  })
}

// 获取支付方式
export function findOrderPayWayOption() {
  return request({
    url: '/order/order/find_pay_way',
    method: 'get',
    params: {}
  })
}

//获取流水概览 卡片数据
export function findCountData(st, et) {
  return request({
    url: '/order/running_account/merchant_running_account_overview_count_data',
    method: 'get',
    params: {
      start_payTime: st,
      end_payTime: et
    }
  })
}

//获取左侧图表菜单
export function getLeftChartMenu() {
  return request({
    url: '/config/admin/config_enum/MerchantStatisticsChartEnum',
    method: 'get',
    params: {
    }
  })
}


//获取右侧图表菜单
export function getRightChartMenu() {
  return request({
    url: '/config/admin/config_enum/MerchantStatisticsPieChartEnum',
    method: 'get',
    params: {
    }
  })
}




//获取左侧图表
export function findLeftChart(st, et,type) {
  return request({
    url: '/order/running_account/merchant_running_account_overview_chart',
    method: 'get',
    params: {
      start_payTime: st,
      end_payTime: et,
      type:type
    }
  })
}



//订单状态饼图
export function findRightChart(st, et,type) {
  return request({
    url: '/order/running_account/merchant_running_account_overview_pie_chart',
    method: 'get',
    params: {
      start_payTime: st,
      end_payTime: et,
      type:type
    }
  })
}



// 获取门店列表
export function findStoreList(pageNum, pageSize, start_payTime, end_payTime) {
  return request({
    url: '/order/running_account/merchant_running_account_list_for_merchant',
    method: 'get',
    params: {
      pageSize,
      pageNum,
      start_payTime,
      end_payTime
    }
  })
}


// 获取订单列表
export function findOrderList(pageNum, pageSize, start_payTime, end_payTime) {
  return request({
    url: '/order/running_account/merchant_running_account_list_for_store',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      start_payTime,
      end_payTime
    }
  })
}



