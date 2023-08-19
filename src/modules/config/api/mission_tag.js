import request from '@/utils/request'
import qs from 'qs'

//获取表格数据
export function getTableList (pageNumber, pageSize,data) {
  return request({
    url: '/merchant/mission_tag/list',
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
  console.log(data)
  return request({
    url: '/merchant/mission_tag/save',
    method: 'post',
    data: qs.stringify(data, {indices: false})
  })
}



//编辑
export function editMethod (data) {
  console.log(data)
  return request({
    url: '/merchant/mission_tag/update',
    method: 'post',
    data: qs.stringify(data, {indices: false})
  })
}

//删除数据
export function deleteMethod (ids) {
  return request({
    url: '/merchant/mission_tag/logical_del',
    method: 'post',
    data: qs.stringify({
      ids
    }, {indices: false})
  })
}



