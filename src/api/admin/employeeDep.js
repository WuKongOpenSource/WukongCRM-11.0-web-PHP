import request from '@/utils/request'

export function depDeleteAPI(data) {
  return request({
    url: 'admin/structures/delete',
    method: 'post',
    data
  })
}

export function depEditAPI(data) {
  return request({
    url: 'admin/structures/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function depSaveAPI(data) {
  return request({
    url: 'admin/structures/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function userEditAPI(params) {
  return request({
    url: 'admin/users/update',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function userAddAPI(params) {
  return request({
    url: 'admin/users/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 角色列表
export function roleListAPI(data) {
  return request({
    url: 'admin/groups/index',
    method: 'post',
    data: data
  })
}

/**
 * 批量修改密码接口
 * @param {*} data
 * password
 * id 用户数组
 */
export function adminUsersUpdatePwdAPI(data) {
  return request({
    url: 'admin/users/updatePwd',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 编辑登录名
 * @param {*} data
 * username
 * password
 * id
 */
export function adminUsersUsernameEditAPI(data) {
  return request({
    url: 'admin/users/usernameEdit',
    method: 'post',
    data: data
  })
}

/**
 * 编辑登录名
 * @param {*} data
 * username
 * password
 * id
 * 可修改管理员
 */
export function adminUsersManagerUsernameEditAPI(data) {
  return request({
    url: 'adminUser/usernameEditByManager',
    method: 'post',
    data: data
  })
}

/**
 * 用户状态修改
 * @param {*} data
 */
export function usersEditStatusAPI(data) {
  return request({
    url: 'admin/users/enables',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 用户导入模板
 * @param {*} data
 */
// export const userImportTemplateURL = 'https://www.72crm.com/npm/static/user_import.xlsx'
export function userImportTemplateAPI(data) {
  return request({
    url: 'admin/users/excelDownload',
    method: 'get',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 用户导入
 * @param {*} data
 */
export function userExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'admin/users/import',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60000
  })
}

/**
 * 下载用户导入错误数据
 * @param {*} data
 *
 */
export function userErrorExcelDownAPI(data) {
  return request({
    url: 'admin/file/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
/**
 * 员工数量
 * @param {*} data
 */
export function adminUserCountNumOfUserAPI() {
  return request({
    url: 'admin/users/countNumOfUser',
    method: 'post'
  })
}
/**
 * 重置部门
 * @param {*} data
 */
export function adminUserSetUserDeptPI(data) {
  return request({
    url: 'admin/users/setUserDept',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
