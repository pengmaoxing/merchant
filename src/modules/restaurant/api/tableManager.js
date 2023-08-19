import request from '@/utils/request'
import qs from 'qs'


/**
 * 桌位----------------------------------------------------
 */
// 获取餐桌全部位置selectItem
export function deskRoomSelectItem() {
  return request({
    url: '/repast/desk_room/find_by_mch_id/select_item',
    method: 'get',
    params: {}
  })
}

// 获取位置列表
export function deskRoomList() {
  return request({
    url: '/repast/desk_room/list_rewrite',
    method: 'get',
    params: {}
  })
}

// 添加位置
export function deskRoomAdd(data) {
  return request({
    url: '/repast/desk_room/save_rewrite',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 修改位置
export function deskRoomUpdate(data) {
  return request({
    url: '/repast/desk_room/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 删除位置
export function deskRoomLogicalDel(ids) {
  return request({
    url: '/repast/desk_room/logical_del',
    method: 'post',
    data: qs.stringify({
      ids,
    }, {indices: false})
  })
}


/**
 * 桌形----------------------------------------------------
 */
// 获取桌形列表
export function deskTypeList() {
  return request({
    url: '/repast/desk_type/list_rewrite',
    method: 'get',
    params: {}
  })
}

// 添加桌形
export function deskTypeAdd(deskType) {
  return request({
    url: '/repast/desk_type/save_rewrite',
    method: 'post',
    data: qs.stringify(
      deskType
    )
  })
}

// 修改桌形
export function deskTypeUpdate(deskType) {
  return request({
    url: '/repast/desk_type/update',
    method: 'post',
    data: qs.stringify(
      deskType
    )
  })
}

// 删除桌形
export function deskTypeLogicalDel(ids) {
  return request({
    url: '/repast/desk_type/logical_del',
    method: 'post',
    data: qs.stringify({
      ids,
    }, {indices: false})
  })
}


// 获取餐桌全部桌形selectItem
export function deskTypeSelectItem() {
  return request({
    url: '/repast/desk_type/find_by_mch_id/select_item',
    method: 'get',
    params: {}
  })
}


/**
 * 餐桌----------------------------------------------------
 */

// 获取餐桌列表
export function deskList(pageNumber, pageSize, data) {
  return request({
    url: '/repast/desk/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      deskTypeId: data.deskTypeId,
      name: data.name,
      status: data.status,
    }
  })
}

// 添加餐桌
export function deskAdd(desk) {
  console.log(desk);
  return request({
    url: '/repast/desk/save_rewrite',
    method: 'post',
    data: qs.stringify(
      desk
    )
  })
}

// 修改餐桌
export function deskUpdate(desk) {
  console.log(desk);
  return request({
    url: '/repast/desk/update',
    method: 'post',
    data: qs.stringify(
      desk
    )
  })
}

// 删除餐桌
export function deskLogicalDel(ids) {
  return request({
    url: '/repast/desk/logical_del',
    method: 'post',
    data: qs.stringify({
      ids,
    }, {indices: false})
  })
}
