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


// 获取储值规则列表
export function findByMerchantId (pageNumber, pageSize) {
  return request({
    url: '/member/stored_rule/list_re',
    method: 'get',
    params: {
      pageSize,
      pageNumber,
    }
  })
}

// 添加储值规则
export function addStoredRule (storedRule) {
  return request({
    url: '/member/stored_rule/save_rewrite',
    method: 'post',
    data: qs.stringify(
      storedRule
    )
  })
}

// 改变储值规则状态,禁用或启用
export function changeStoredRuleStatus (id, status) {
  return request({
    url: '/member/stored_rule/update_stored_rule ',
    method: 'post',
    data: qs.stringify({
      id,
      status
    })
  })
}

//删除储值规则
export function deleteStoredRule (ids) {
  return request({
    url: '/member/stored_rule/logical_del',
    method: 'post',
    data: qs.stringify({
      ids
    }, {indices: false})
  })
}

//获取储值规则开关
export function findSwitchByMchId () {
  return request({
    url: '/member/stored_switch/find_by_merchantId',
    method: 'get',
  })
}

//修改储值规则开关
export function updateSwitch (s, id) {
  return request({
    url: '/member/stored_switch/update',
    method: 'post',
    data: qs.stringify({
        status: s,
        id: id
      }
    )
  })
}

//储值记录列表
export function findRecordList (pageNumber, pageSize, form) {
  return request({
    url: '/member/stored_recored/find_by_merchant_id',
    method: 'get',
    params: {
      pageSize: pageSize,
      pageNumber: pageNumber,
      phone: form.phone,
      start_createTime: form.start_createTime,
      end_createTime: form.end_createTime,
      tradeType: form.tradeType,
      source: form.source,
      storeId: form.storeId,
      payWay: form.payWay,
    }
  })
}

//储值记录列表导出
export function listExport (form) {
  return request({
    url: '/member/stored_recored/find_by_merchant_id_export',
    method: 'get',
    responseType: 'blob',
    params: {
      phone: form.phone,
      start_createTime: form.start_createTime,
      end_createTime: form.end_createTime,
      tradeType: form.tradeType,
      source: form.source,
      storeId: form.storeId,
      payWay: form.payWay,
    }
  })
}

//储值记录卡片
export function findRecordCard (form) {
  return request({
    url: '/member/stored_recored/search_stored_amount',
    method: 'get',
    params: {
      phone: form.phone,
      start_createTime: form.start_createTime,
      end_createTime: form.end_createTime,
      tradeType: form.tradeType,
      source: form.source,
    }
  })
}
