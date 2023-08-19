import request from '@/utils/request'
import qs from 'qs'

/**
 * =====================菜品模块======================
 */

// 获取菜品
export function getFoodList(pageNumber, pageSize, form) {
  return request({
    url: '/repast/food/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: form.name,
      storeId: sessionStorage.getItem('storeId')
    }
  })
}


/**
 * 添加菜品
 */
export function addFood(form) {
  return request({
    url: '/repast/food/save_rewrite',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

/**
 * 修改菜品
 */
export function editFood(form) {
  return request({
    url: '/repast/food/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}

/**
 * 删除菜品
 */
export function deleteFood(ids) {
  return request({
    url: '/repast/food/logical_del',
    method: 'post',
    data: qs.stringify({
      ids,
    }, {indices: false})
  })
}


/**
 * 餐盒费------------------------------------------------------
 */


export function getPackageMoney() {
  return request({
    url: '/repast/meal_box/find_by_mch_id',
    method: 'get',
    params: {}
  })
}

export function savePackageMoney(mealFee, id) {
  return request({
    url: '/repast/meal_box/update',
    method: 'post',
    data: qs.stringify({
      mealFee: mealFee,
      id: id
    })
  })
}


/**
 * 菜品类型---------------------------------------------------
 */

export function getFoodType() {
  return request({
    url: '/repast/food_type/find_by_mch_id/select_item',
    method: 'get',
    params: {}
  })
}

// 新增
export function saveFoodType(data) {
  return request({
    url: '/repast/food_type/save_rewrite',
    method: 'POST',
    data: qs.stringify(
      data
    )
  })
}

//修改
export function modifyFoodType(id, data) {
  return request({
    url: '/repast/food_type/update',
    method: 'POST',
    data: qs.stringify({
      id: id,
      name: data.name
    })
  })
}

//删除
export function deleteFoodType(id) {
  return request({
    url: '/repast/food_type/logical_del',
    method: 'POST',
    data: qs.stringify({
      ids: id,
    })
  })
}

//------------------------外卖----------------------------------

export function getTakeOutConfig() {
  return request({
    url: '/repast/delivery/find_by_mch_id',
    method: 'get',
    params: {}
  })
}

export function updateTakeOutConfig(form) {
  return request({
    url: '/repast/delivery/update',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}




