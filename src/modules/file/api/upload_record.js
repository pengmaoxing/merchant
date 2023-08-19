import request from '@/utils/request'
import {uploadPrefix} from './constant'

//获取列表
export function getUploadRecordList(pageNumber, pageSize) {
  return request({
    url: uploadPrefix + 'upload/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}

