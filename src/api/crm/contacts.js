import request from '@/utils/request'

/**
 * 新建联系人
 * @param {*} data
 */
export function crmContactsSaveAPI(data) {
  var url = data.id ? 'update' : 'save'
  return request({
    url: 'crm/contacts/' + url,
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
export function crmContactsIndexAPI(data) {
  return request({
    url: 'crm/contacts/index',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmContactsDeleteAPI(data) {
  return request({
    url: 'crm/contacts/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 详情
 * @param {*} data
 */
export function crmContactsReadAPI(data) {
  return request({
    url: `crm/contacts/read`,
    method: 'post',
    data
  })
}

/**
 * 联系人转移
 * @param {*} data
 */
export function crmContactsTransferAPI(data) {
  return request({
    url: 'crm/contacts/transfer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 联系人下商机
 * @param {*} data
 */
export function crmContactsQueryBusinessAPI(data) {
  return request({
    url: 'crm/business/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 联系人导出
 * @param {*} data
 * Contacts_id 联系人ID
 */
export function crmContactsExcelExportAPI(data) {
  return request({
    url: 'crm/contacts/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob'
  })
}

export function crmContactsExcelAllExportAPI(data) {
  return request({
    url: 'crm/contacts/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 联系人导入
 * @param {*} data
 *
 */
export function crmContactsExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'crm/contacts/excelImport',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 联系人导入模板下载
 * @param {*} data
 *
 */
export const crmContactsExcelDownloadURL = window.BASE_URL + 'crmContacts/downloadExcel'
export function crmContactsDownloadExcelAPI(data) {
  return request({
    url: 'crm/contacts/excelDownload',
    method: 'get',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 联系人关联商机
 * @param {*} data
 */
export function crmContactsRelateBusinessAPI(data) {
  return request({
    url: 'crm/contacts/relation',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 联系人取消关联商机
 * @param {*} data
 */
export function crmContactsUnrelateBusinessAPI(data) {
  return request({
    url: 'crm/contacts/relation',
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
export function crmContactsFileListAPI(data) {
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
export function crmContactsNumAPI(data) {
  return request({
    url: 'crm/contacts/count',
    method: 'post',
    data: data
  })
}

/**
 * 标星
 * @param {*} data
 *
 */
export function crmContactsStarAPI(data) {
  return request({
    url: `crm/contacts/star`,
    method: 'post',
    data
  })
}
