import request from '@/utils/request'

/**
 * 新建 编辑
 * @param {*} data
 */
export function crmLeadsSaveAPI(data) {
  const url = data.id && data.name ? 'update' : 'save'
  return request({
    url: 'crm/leads/' + url,
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
export function crmLeadsIndexAPI(data) {
  return request({
    url: 'crm/leads/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmLeadsDeleteAPI(data) {
  return request({
    url: 'crm/leads/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 详情
 * @param {*} id
 */
export function crmLeadsReadAPI(data) {
  return request({
    url: `crm/leads/read`,
    method: 'post',
    data
  })
}

/**
 * 线索转移
 * @param {*} data
 */
export function crmLeadsTransferAPI(data) {
  return request({
    url: 'crm/leads/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 线索转换为客户
 * @param {*} data
 */
export function crmLeadsTransformAPI(data) {
  return request({
    url: 'crm/leads/transform',
    method: 'post',
    data: data
  })
}

/**
 * 线索导出
 * @param {*} data
 *
 */
export function crmLeadsExcelExportAPI(data) {
  return request({
    url: 'crm/leads/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob'
  })
}

/**
 * 线索全部导出
 * @param {*} data
 */
export function crmLeadsExcelAllExportAPI(data) {
  return request({
    url: 'crm/leads/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 线索导入
 * @param {*} data
 *
 */
export function crmLeadsExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'crm/leads/excelImport',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 线索导入模板下载
 * @param {*} data
 *
 */
export const crmLeadsExcelDownloadURL = window.BASE_URL + 'crm/leads/excelDownload'
export function crmLeadsDownloadExcelAPI(data) {
  return request({
    url: 'crm/leads/excelDownload',
    method: 'get',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 线索标记跟进
 * @param {*} data
 * id 客户IDs
 */
export function crmLeadsSetFollowAPI(data) {
  return request({
    url: 'crm/message/allDeal',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmLeadsFileListAPI(data) {
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
export function crmLeadsNumAPI(data) {
  return request({
    url: 'crm/leads/count',
    method: 'post',
    data: data
  })
}

/**
 * 标星
 * @param {*} data
 *
 */
export function crmLeadsStarAPI(data) {
  return request({
    url: `/crm/leads/star`,
    method: 'post',
    data: data
  })
}
