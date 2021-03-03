import request from '@/utils/request'

/**
 * 新建回款
 * @param {*} data
 */
export function crmReceivablesSaveAPI(data) {
  const url = data.id ? 'update' : 'save'
  return request({
    url: 'crm/receivables/' + url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回款列表
 * @param {*} data
 */
export function crmReceivablesIndexAPI(data) {
  return request({
    url: 'crm/receivables/index',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 *
 */
export function crmReceivablesDeleteAPI(data) {
  return request({
    url: 'crm/receivables/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回款详情
 * @param {*} data
 */
export function crmReceivablesReadAPI(data) {
  return request({
    url: `crm/receivables/read`,
    method: 'post',
    data
  })
}

/**
 * 回款计划删除
 * @param {*} data
 */
export function crmReceivablesPlanDeleteAPI(data) {
  return request({
    url: 'crm/receivables_plan/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回款列表
 * @param {*} data
 *
 */
export function crmReceivablesFileListAPI(data) {
  return request({
    url: 'admin/file/index',
    method: 'post',
    data: data
  })
}

/**
 * tab数量
 * @param {*} data
 *
 */
export function crmReceivablesNumAPI(data) {
  return request({
    url: 'crm/receivables/count',
    method: 'post',
    data: data
  })
}

/**
 * 导出
 * @param {*} data
 */
export function crmReceivablesExcelExportAPI(data) {
  return request({
    url: 'crm/receivables/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmReceivablesExcelAllExportAPI(data) {
  return request({
    url: 'crm/receivables/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 转移
 * @param {*} data
 */
export function crmReceivablesTransferAPI(data) {
  return request({
    url: 'crm/receivables/transfer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回款计划创建
 * @param {*} data
 */
export function crmReceivablesPlanSaveAPI(data) {
  const url = data.id ? 'update' : 'save'
  return request({
    url: 'crm/receivables_plan/' + url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
