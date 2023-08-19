import request from '@/utils/request'
import qs from 'qs'

// 获取列表
export function qrcodeList(pageNumber, pageSize, searchForm) {
  let storeId = searchForm.store
  let userId = searchForm.user
  let status = searchForm.status
  let name = searchForm.name
  return request({
    url: '/merchant/mch_qr_code/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      storeId,
      userId,
      status,
      name
    }
  })
}

// 添加
export function qrcodeAdd(printerArea) {
  return request({
    url: '/merchant/mch_qr_code/save_rewrite',
    method: 'post',
    data: qs.stringify(
      printerArea
    )
  })
}

// 修改
export function qrcodeUpdate(printerArea) {
  return request({
    url: '/merchant/mch_qr_code/update_rewrite',
    method: 'post',
    data: qs.stringify(
      printerArea
    )
  })
}

//获取门店下拉
export function findMerchant() {
  return request({
    url: '/merchant/store/find_by_merchant_id',
    method: 'get',
    params: {}
  })
}

//获取用户下拉
export function findUser() {
  return request({
    url: '/merchant/user/select_item/by_user_id',
    method: 'get',
    params: {}
  })
}

//单个下载
export function downloadQrCode(storeName,qrCodePathStr,qrCodeUrl) {
  return request({
    url: '/merchant/mch_qr_code/download_qr_code',
    method: 'get',
    params: {
      storeName,
      qrCodePathStr,
      qrCodeUrl,
    }
  })
}

//多个下载
export function downloadBatchQrCode(qrArr) {
  return request({
    url: '/merchant/mch_qr_code/batch_download_qr_code',
    method: 'post',
    data:qs.stringify({
      dtoStr:qrArr
    })
  })
}


//通过门店获取用户下拉
export function findUserByStore(id) {
  return request({
    url: '/merchant/user/select_item/by_store_id',
    method: 'get',
    params: {
      storeId: id
    }
  })
}

//开启二维码
export function onQRCODE(id) {
  return request({
    url: '/merchant/mch_qr_code/update_status',
    method: 'post',
    data: qs.stringify({
      id: id,
      status: 1
    })
  })
}

//关闭二维码
export function offQRCODE(id) {
  return request({
    url: '/merchant/mch_qr_code/update_status',
    method: 'post',
    data: qs.stringify({
      id: id,
      status: 2
    })
  })
}






