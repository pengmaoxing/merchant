import request from '@/utils/request'
import qs from 'qs'

//获取表格数据
export function getTableList(pageNumber, pageSize, searchData) {
  return request({
    url: '/merchant/store/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: searchData.name,
      status: searchData.status,
    }
  })
}

// 登录账号是商户还是店长
export function storeDetail(id) {
  return request({
    url: '/merchant/store/find_one',
    method: 'get',
    params: {
      id
    }
  })
}

// 添加门店
export function addStore(form) {
  return request({
    url: '/merchant/store/save_rewrite',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

// 修改门店
export function editStore(form) {
  return request({
    url: '/merchant/store/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

// 绑定设备
export function bindCloudSound(storeId) {
  return request({
    url: '/merchant/admin/bind_cloud_sound',
    method: 'post',
    data: qs.stringify({
        storeId: storeId + ''
      }
    )
  })
}

// 解绑设备
export function unbindCloudSound(storeId) {
  return request({
    url: '/merchant/admin/relieve_cloud_sound',
    method: 'post',
    data: qs.stringify({
        storeId: storeId + ''
      }
    )
  })
}








