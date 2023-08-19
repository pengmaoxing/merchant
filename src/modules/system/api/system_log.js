import request from '@/utils/request'
import qs from 'qs'

// 获取日志
export function getLog (pageNumber, pageSize) {
  return request({
    url: '/admin/log/list',
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}

// 删除日志
export function deleteLog (ids) {
  return request({
    url: '/admin/log/delete',
    method: 'post',
    data: qs.stringify({
      ids
    }, { indices: false })
  })
}

// 删除全部日志
export function deleteAllLog () {
  return request({
    url: '/admin/log/deleteAll',
    method: 'post'
  })
}
