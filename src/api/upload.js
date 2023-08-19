import request from '@/utils/request'
// import qs from 'qs'

// 获取token列表
export function uploadFile (form) {
  // 返回一个Promise对象
  return request({
    url: '/fms/upload/files_upload',
    method: 'post',
    data: form
  })
}
