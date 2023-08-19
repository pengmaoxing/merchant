import request from '@/utils/request'
import qs from 'qs'

//获取门店数据
export function getTableList(pageNumber, pageSize) {
  return request({
    url: '/merchant/store/default_by_mch_id',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
    }
  })
}
