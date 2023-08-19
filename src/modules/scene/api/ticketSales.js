import request from '@/utils/request'
import qs from 'qs'

//获取订单列表
export function getOrderList(pageNumber,pageSize,merchantId,start_createTime,end_createTime) {
  return request({
    url: '/ticket/order/list',
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

//获取门票列表
export function getTicketList(pageNumber,pageSize,merchantId) {
  return request({
    url: '/ticket/model/list',
    method: 'get',
    params: {
      merchantId: merchantId,
      pageNumber: pageNumber,
      pageSize: pageSize
    }
  })
}

//获取门票列表
export function getTicketType(ticketOrderInfoId) {
  return request({
    url: '/ticket/order/ticket_type',
    method: 'get',
    params: {
      ticketOrderInfoId: ticketOrderInfoId,
    }
  })
}

//获取景点信息
export function findScenic(pageNumber,pageSize,merchantId) {
  return request({
    url: '/ticket/scenic/find_msg',
    method: 'get',
    params: {
    }
  })
}

//保存景点信息
export function scenicSave(form) {
  return request({
    url: '/ticket/scenic/save',
    method: 'post',
    data:qs.stringify(form)
  })
}

//编辑景点信息
export function scenicModify(form) {
  return request({
    url: '/ticket/scenic/update',
    method: 'post',
    data:qs.stringify(form)
  })
}

//保存门票信息
export function ticketSave(form) {
  return request({
    url: '/ticket/model/save',
    method: 'post',
    data:qs.stringify(form)
  })
}

//编辑门票信息
export function ticketModify(form) {
  return request({
    url: '/ticket/model/update',
    method: 'post',
    data:qs.stringify(form)
  })
}

//批量删除门票信息
export function ticketDelete(ids) {
  return request({
    url: '/ticket/model/delete',
    method: 'post',
    data:qs.stringify({
      ids
    }, { indices: false })
  })
}
