import request from '@/utils/request'
import qs from 'qs'

// 获取积分规则参数
export function findPointsRuler () {
  return request({
    url: '/member/credits_ruler/find',
    method: 'get',
    params: {}
  })
}

// 保存积分规则
export function savePointsRuler (form) {
  return request({
    url: '/member/credits_ruler/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

// 保存积分商品库存
export function modifyProductStock (id, result) {
  return request({
    url: '/member/credits_product/update',
    method: 'post',
    data: qs.stringify({
      productNums: result,
      id: id
    })
  })
}

// 积分商城列表
export function getPointProduct (pageNumber, pageSize, form) {
  return request({
    url: '/member/credits_product/list_re',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      productName: form.productName,
      status: form.status
    }
  })
}

// 删除
export function deletePointProduct (id) {
  return request({
    url: '/member/credits_product/delete',
    method: 'post',
    data: qs.stringify({
      ids: id
    })
  })
}

// 提前结束活动
export function overPointProduct (id) {
  return request({
    url: '/member/credits_product/update',
    method: 'post',
    data: qs.stringify({
      id: id,
      interrupt: 1,
      status: 2
    })
  })
}

// 获取兑换记录
export function findRecord (pageNumber, pageSize, form) {
  return request({
    url: '/member/change_record/list_re',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      phone: form.phone,
      start_exchangeTime: form.start_exchangeTime,
      end_exchangeTime: form.end_exchangeTime,
    }
  })
}

// 导出兑换记录
export function exportRecord () {
  return request({
    url: '/member/export/exchange_record_export',
    method: 'get',
    params: {}
  })
}

// 获取活动详情
export function findGoodDetail (id) {
  return request({
    url: '/member/credits_product/search',
    method: 'get',
    params: {
      id: id
    }
  })
}

// 新增活动
export function addProduct (form) {
  return request({
    url: '/member/credits_product/save_re',
    method: 'post',
    data: qs.stringify({
      exchangeStart: form.exchangeStart,
      exchangeEnd: form.exchangeEnd,
      exchangeMessage: form.exchangeMessage,
      credits: form.credits,
      productName: form.productName,
      productMoney: form.productMoney,
      imgUrl: form.imgUrl,
      productNums: form.productNums,
      isLimited: form.isLimited,
      limitedNum: form.limitedNum,
      status: 0,
      interrupt: 0
    })
  })
}
