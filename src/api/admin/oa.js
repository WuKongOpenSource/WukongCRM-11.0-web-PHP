import request from '@/utils/request'

/**
 * 审批类型列表
 * @param {*} data
 */
export function oaExamineCategoryListAPI(data) {
  return request({
    url: 'oa/examine/category',
    method: 'post',
    data: data
  })
}

/**
 * 审批类型的创建
 * @param {*} data
 */
export function oaExamineCategorySaveAPI(data) {
  return request({
    url: `oa/examine/${data.id ? 'categoryUpdate' : 'categorySave'}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 审批删除
 * @param {*} data
 */
export function oaExamineCategoryDeleteAPI(data) {
  return request({
    url: 'oa/examine/categoryDelete',
    method: 'post',
    data: data
  })
}

/**
 * 审批状态（启用、停用）
 * @param {*} data
 */
export function oaExamineCategoryEnablesAPI(data) {
  return request({
    url: 'oa/examine/categoryEnables',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
