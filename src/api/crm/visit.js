import request from '@/utils/request'

/**
 * 新建
 * @param {*} data
 */
export function crmReturnVisitSaveAPI(data) {
  const url = data.id ? 'update' : 'save'
  return request({
    url: 'crm/visit/' + url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 列表
 * @param {*} data
 */
export function crmReturnVisitIndexAPI(data) {
  return request({
    url: 'crm/visit/index',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmReturnVisitDeleteAPI(data) {
  return request({
    url: 'crm/visit/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 附件
 * @param {*} data
 */
export function crmReturnVisitFileAPI(data) {
  return request({
    url: 'admin/file/index',
    method: 'post',
    data: data
  })
}

/**
 * 详情
 * @param {*} visitId
 */
export function crmReturnVisitReadAPI(data) {
  return request({
    url: `crm/visit/read`,
    method: 'post',
    data
  })
}
