import request from '@/utils/request'

/**
 * 审批类型列表
 * @param {*} data
 */
export function oaAllExamineCategoryListAPI(data) {
  return request({
    url: 'oa/examine/categoryList',
    method: 'post',
    data: data
  })
}

/**
 * 审批类型前台排序
 * @param {*} data
 */
export function oaAllExamineCategorySortAPI(data) {
  return request({
    url: 'oa/examine/examineSort',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 审批新建
 * @param {*} data
 */
export function oaExamineSaveAndUpdateAPI(data) {
  return request({
    url: `oa/examine/${data.id ? 'update' : 'save'}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 我发起的审批
 * @param {*} data
 */
export function oaExamineMyCreateIndexAPI(data) {
  return request({
    url: 'oa/examine/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 我审批的
 * @param {*} data
 */
export function oaExamineMyExamineIndexAPI(data) {
  return request({
    url: 'oa/examine/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 审批删除
 * @param {*} data
 */
export function oaExamineDeleteAPI(data) {
  return request({
    url: 'oa/examine/delete',
    method: 'post',
    data: data
  })
}

/**
 * 审批详情
 * @param {*} examineId
 */
export function oaExamineReadAPI(data) {
  return request({
    url: `oa/examine/read`,
    method: 'post',
    data
  })
}

// 新建的审批流
/**
 * CRM合同回款创建时候的审批流
 * @param {*} data
 */
export function oaCreateExamineFlowAPI(data) {
  return request({
    url: 'admin/examine_flow/stepList',
    method: 'post',
    data: data
  })
}

/**
 * 审批详情 基本信息
 * @param {*} data
 */
export function oaExamineGetFieldAPI(data) {
  return request({
    url: 'admin/field/getField',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 办公下 审批的审批信息
 * @param {*} data
 */
export function oaExamineFlowStepListAPI(data) {
  return request({
    url: 'admin/examine_flow/stepList',
    method: 'post',
    data: data
  })
}

/**
 * 审批记录
 * @param {*} data
 */
export function oaExamineFlowRecordListAPI(data) {
  return request({
    url: 'admin/examine_flow/recordList',
    method: 'post',
    data: data
  })
}

/**
 * 审批的审核
 * @param {*} data
 */
export function oaExamineFlowAuditExamineAPI(data) {
  const url = data.type === 'revoke' ? 'oa/examine/revokeCheck' : 'oa/examine/check'
  return request({
    url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 审批的撤回审核
 * @param {*} data
 */
export function oaExamineFlowRevokeCheckAPI(data) {
  return request({
    url: 'oa/examine/revokeCheck',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 审批导出
 * @param {*} data
 */
export function oaExamineExportAPI(data) {
  return request({
    url: 'oa/examine/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob'
  })
}
