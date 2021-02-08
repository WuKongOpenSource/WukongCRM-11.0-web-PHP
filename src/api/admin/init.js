import request from '@/utils/request'

/**
 * 验证密码
 * @param {*} data
 */
export function adminConfigVerifyPasswordAPI(data) {
  return request({
    url: 'admin/initialize/verification',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 模块初始化
 * @param {*} data
 */
export function adminConfigModuleInitDataAPI(data) {
  return request({
    url: 'admin/initialize/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
