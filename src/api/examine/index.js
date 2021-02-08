/**
 * Create by yxk at 2020/6/22
 */
import request from '@/utils/request'

/**
 * 查询所有未删除审批流程
 * @param {*} data
 */
export function crmExamineQueryAllAPI(data) {
  return request({
    url: 'admin/examine_flow/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// /**
//  * 根据id查询审批流程 examineId 审批流程id
//  */
// export function QueryExamineById(data) {
//   return request({
//     url: `crmExamine/queryExamineById/${data.examineId}`,
//     method: 'post'
//   })
// }

/**
 * 查询当前启用审核流程步骤
 */
export function crmExamineStepAPI(data) {
  return request({
    url: 'admin/examine_flow/stepList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 添加审批流程
 */
export function crmExamineSaveAPI(data) {
  return request({
    url: `admin/examine_flow/${data.flow_id ? 'update' : 'save'}`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 停用或删除审批流程
 */
export function crmExamineUpdateStatusAPI(data) {
  return request({
    url: 'admin/examine_flow/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 停用或删除审批流程
 */
export function crmExamineEnablesStatusAPI(data) {
  return request({
    url: 'admin/examine_flow/enables',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 进行审批 AuditExamine  合同
 */
export function crmExamineRecordAuditAPI(data) {
  const url = data.type === 'revoke' ? 'crm/contract/revokeCheck' : 'crm/contract/check'
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
 * 进行审批 发票
 */
export function crmExamineInvoiceAuditAPI(data) {
  const url = data.type === 'revoke' ? 'crm/invoice/revokeCheck' : 'crm/invoice/check'
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
 * 进行审批 回款
 */
export function crmExamineReceivablesAuditAPI(data) {
  const url = data.type === 'revoke' ? 'crm/receivables/revokeCheck' : 'crm/receivables/check'
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
 * 查询审批记录
 */
export function crmExamineRecordLogListAPI(data) {
  return request({
    url: 'admin/examine_flow/recordList',
    method: 'post',
    data: data
  })
}

/**
 * 查询审批流程列表
 */
export function crmExamineRecordRecordListAPI(data) {
  return request({
    url: 'admin/examine_flow/stepList',
    method: 'post',
    data: data
  })
}
