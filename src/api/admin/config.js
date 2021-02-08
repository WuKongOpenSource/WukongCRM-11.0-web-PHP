import request from '@/utils/request'

/**
 * 企业首页
 * @param {*} data
 */
export function adminSystemSaveAPI(data) {
  return request({
    url: 'admin/system/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 企业首页
 * @param {*} data
 */
export function adminSystemIndexAPI(data) {
  return request({
    url: 'admin/system/index',
    method: 'post',
    data: data
  })
}
