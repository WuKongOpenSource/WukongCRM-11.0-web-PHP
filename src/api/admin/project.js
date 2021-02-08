import request from '@/utils/request'

/**
 * 列表
 * @param {*} data
 */
export function systemRoleQueryProjectRoleListAPI(data) {
  return request({
    url: 'admin/work/roles',
    method: 'post',
    data: data
  })
}

/**
 * 角色
 * @param {*} data
 */
export function systemMenuGetWorkMenuListAPI(data) {
  return request({
    url: 'admin/work/rules',
    method: 'post',
    data: data
  })
}

/**
 * 设置
 * @param {*} data
 */
export function systemRoleSetWorkRoleAPI(data) {
  return request({
    url: `admin/work/${data.id ? 'updateRole' : 'saveRole'}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 删除项目角色
 */
export function systemRoleDeleteWorkRoleAPI(data) {
  return request({
    url: 'admin/work/deleteRole',
    method: 'post',
    data: data
  })
}

