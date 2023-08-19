import request from '@/utils/request'
import qs from 'qs'

// 获取商品列表
export function findGoodsList(pageNum, pageSize) {
  return request({
    url: '/luxury/goods/list_re',
    method: 'get',
    params: {
      pageSize: pageSize,
      pageNumber: pageNum,
    }
  })
}

//获取全类目
export function findAllCategory() {
  return request({
    url: '/luxury/goods/find_category',
    method: 'get',
    params: {}
  })
}

// 获取大类目
export function findBigCategory() {
  return request({
    url: '/luxury/goods/find_big_category',
    method: 'get',
    params: {}
  })
}

// 获取小类目
export function findSmallCategory(id) {
  return request({
    url: '/luxury/goods/find_small_category',
    method: 'get',
    params: {
      bigCategoryId: id
    }
  })
}

//创建小类目
export function smallCategoryAdd(id, name) {
  return request({
    url: '/luxury/goods/save_small_category',
    method: 'post',
    data: qs.stringify({
      bigCategoryId: id,
      name: name
    })
  })
}

//创建大类目
export function bigCategoryAdd(name) {
  return request({
    url: '/luxury/goods/save_big_category',
    method: 'post',
    data: qs.stringify({
      name: name
    })
  })
}

//编辑大类目
export function bigCategoryModify(id, name) {
  return request({
    url: '/luxury/goods/save_big_category',
    method: 'post',
    data: qs.stringify({
      id: id,
      name: name
    })
  })
}

//编辑小类目
export function smallCategoryModify(masterid, id, name) {
  return request({
    url: '/luxury/goods/save_small_category',
    method: 'post',
    data: qs.stringify({
      id: id,
      bigCategoryId: masterid,
      name: name
    })
  })
}

//删除小类目
export function smallCategoryDelete(id) {
  return request({
    url: '/luxury/goods/delete_small_category',
    method: 'post',
    data: qs.stringify({
      smallCategoryId: id,
    })
  })
}

//删除大类目
export function bigCategoryDelete(id) {
  return request({
    url: '/luxury/goods/delete_big_category',
    method: 'post',
    data: qs.stringify({
      bigCategoryId: id,
    })
  })
}


// 保存新商品
export function goodSave(form) {
  return request({
    url: '/luxury/goods/save_re',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

// 编辑新商品
export function goodModify(form) {
  return request({
    url: '/luxury/goods/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

// 删除新商品
export function goodDelete(id) {
  return request({
    url: '/luxury/goods/delete_re',
    method: 'post',
    data: qs.stringify({
      luxuryGoodsId: id
    })
  })
}

// 批量删除商品
export function goodDeleteIds(ids) {
  return request({
    url: '/luxury/goods/delete_ids',
    method: 'post',
    data: qs.stringify({
      ids: ids
    }, {indices: false})
  })
}
