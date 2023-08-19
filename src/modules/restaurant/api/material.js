import request from '@/utils/request'
import qs from 'qs'

// 获取物料文件
export function getMaterial(merchantId) {
  return request({
    url: '/repast/material/download',
    method: 'get',
    responseType: 'blob',
    params:{
      merchantId:merchantId
    }
  })
}
