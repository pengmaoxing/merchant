import request from '@/utils/request'
import qs from 'qs'

// 获取打印机
export function getPrintList() {
  return request({
    url: '/repast/feie_printer/list_rewrite',
    method: 'get',
    params: {}
  })
}

// 新增打印机
export function savePrint(form) {
  return request({
    url: '/repast/feie_printer/save_rewrite',
    method: 'post',
    data: qs.stringify(form)
  })
}

// 修改打印机
export function modifyPrint(form) {
  return request({
    url: '/repast/feie_printer/update',
    method: 'post',
    data: qs.stringify(form)
  })
}


// 删除打印机
export function deletePrint(id) {
  return request({
    url: '/repast/feie_printer/logical_del',
    method: 'post',
    data: qs.stringify({
      ids: id
    })
  })
}
