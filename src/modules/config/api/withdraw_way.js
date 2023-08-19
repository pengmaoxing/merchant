import request from '@/utils/request'
import qs from 'qs'

//获取表格数据
export function getTableList (pageNumber, pageSize,data) {
  return request({
    url: '/brush/withdraw_way/list',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      data,
    }
  })
}

//创建
export function createdMethod (data) {
  return request({
    url: '/brush/withdraw_way/save',
    method: 'post',
    params: {
      name:data.name,
    },
  })
}



//编辑
export function editMethod (date) {
  console.log(date)
  return request({
    url: '/brush/withdraw_way/update',
    method: 'post',
    data: qs.stringify({
      id:date.withdrawWayId,
      name: date.name,
    }, {indices: false})
  })
}

//删除数据
export function deleteMethod (ids) {
  return request({
    url: '/brush/withdraw_way/logical_del',
    method: 'post',
    data: qs.stringify({
      ids
    }, {indices: false})
  })
}



