import request from '@/utils/request'

/**
 * 新建
 * @param {*} data
 */
export function crmInvoiceSaveAPI(data) {
  return request({
    url: 'crm/invoice/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 编辑
 * @param {*} data
 */
export function crmInvoiceUpdateAPI(data) {
  return request({
    url: 'crm/invoice/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标注已开发票
 * @param {*} data
 */
export function crmInvoiceStatusUpdateAPI(data) {
  return request({
    url: 'crm/invoice/setInvoice',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标注已开发票
 * @param {*} data
 */
export function crmInvoiceStatusResetAPI(data) {
  return request({
    url: 'crm/invoice/resetInvoiceStatus',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 分页查询发票
 * @param {*} data
 */
export function crmInvoiceIndexAPI(data) {
  return request({
    url: 'crm/invoice/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 发票详情
export function crmInvoiceReadAPI(data) {
  return request({
    url: `crm/invoice/read`,
    method: 'post',
    data
  })
}
// 发票table数量
export function crmInvoiceNumAPI(data) {
  return request({
    url: `crm/invoice/count`,
    method: 'post',
    data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmInvoiceFileListAPI(data) {
  return request({
    url: 'admin/file/index',
    method: 'post',
    data: data
  })
}

/**
 * 转移
 * @param {*} data
 */
export function crmInvoiceTransferAPI(data) {
  return request({
    url: 'crm/invoice/transfer',
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
export function crmInvoiceDeleteIdsAPI(data) {
  return request({
    url: 'crm/invoice/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 发票规则信息
 * @param {*} data
 */
export function crmInvoiceNumberConfigAPI(data) {
  return request({
    url: 'crm/index/autoNumberStatus',
    method: 'post',
    data: data
  })
}

/**
 * 新建发票信息
 * @param {*} data
 */
export function crmInvoiceSaveInvoiceInfoAPI(data) {
  return request({
    url: 'crm/invoiceInfo/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 编辑发票信息
 * @param {*} data
 */
export function crmInvoiceUpdateInvoiceInfoAPI(data) {
  return request({
    url: 'crm/invoiceInfo/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除发票信息
 * @param {*} data
 */
export function crmInvoiceDeleteInvoiceInfoAPI(data) {
  return request({
    url: 'crm/invoiceInfo/delete',
    method: 'post',
    data: data
  })
}

/**
 * 发票全部导出
 * @param {*} data
 */
export function crmInvoiceExcelAllExportAPI(data) {
  return request({
    url: 'crm/invoice/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
