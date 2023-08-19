import request from '@/utils/request'
import qs from 'qs'

//获取表格数据
export function getTableList (pageNumber, pageSize,data) {
  return request({
    url: '/merchant/mission_source/list',
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
    url: '/merchant/mission_source/save',
    method: 'post',
    params: {
      name:data.name,
      logoId:data.iconId
    },
  })
}



//编辑
export function editMethod (date) {
  console.log(date)
  return request({
    url: '/merchant/mission_source/update',
    method: 'post',
    data: qs.stringify({
      id:date.missionSourceId,
      name: date.name,
      logoId:date.iconId
    }, {indices: false})
  })
}

//删除数据
export function deleteMethod (ids) {
  return request({
    url: '/merchant/mission_source/logical_del',
    method: 'post',
    data: qs.stringify({
      ids
    }, {indices: false})
  })
}



