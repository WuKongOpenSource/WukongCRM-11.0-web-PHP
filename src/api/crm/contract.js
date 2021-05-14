import request from '@/utils/request'

/**
 * 新建合同
 * @param {*} data
 */
export function crmContractSaveAPI(data) {
  const url = data.id ? 'update' : 'save'
  return request({
    url: 'crm/contract/' + url,
    method: 'post',
    data: data
  })
}

/**
 * 列表
 * @param {*} data
 */
export function crmContractIndexAPI(data) {
  return request({
    url: 'crm/contract/index',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmContractDeleteAPI(data) {
  return request({
    url: 'crm/contract/delete',
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
export function crmContractReadAPI(data) {
  return request({
    url: `crm/contract/read`,
    method: 'post',
    data
  })
}

/**
 * 合同相关产品
 * @param {*} data
 * contract_id
 */
export function crmContractProductAPI(data) {
  return request({
    url: 'crm/contract/product',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 转移
 * @param {*} data
 */
export function crmContractTransferAPI(data) {
  return request({
    url: 'crm/contract/transfer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 合同下回款
 * @param {*} data
 */
export function crmContractQueryReceivablesAPI(data) {
  return request({
    url: 'crm/receivables/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 合同下回款计划
 * @param {*} data
 */
export function crmContractQueryReceivablesPlanAPI(data) {
  return request({
    url: 'crm/receivables_plan/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 团队操作
/**
 * 团队成员创建
 * @param {*} data
 */
export function crmContractSettingTeamSaveAPI(data) {
  return request({
    url: 'crm/setting/teamSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function crmContractSettingTeamDeleteAPI(data) {
  return request({
    url: 'crm/setting/teamSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function crmContractTeamMembersAPI(data) {
  return request({
    url: `crm/setting/team`,
    method: 'post',
    data
  })
}

export function crmContractUpdateMembersAPI(data) {
  return request({
    url: 'crm/setting/teamSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 退出团队
 * @param {*} data
 */
export function crmContractExitTeamAPI(data) {
  return request({
    url: `crm/setting/quitTeam`,
    method: 'post',
    data
  })
}

/**
 * 新建回款查询回款计划
 * @param {*} data
 */
export function crmQueryReceivablesPlansByContractIdAPI(data) {
  return request({
    url: 'crm/receivables_plan/index',
    method: 'post',
    data: data
  })
}

/**
 * 作废
 * @param {*} data
 */
export function crmContractCancelAPI(data) {
  return request({
    url: 'crm/contract/cancel',
    method: 'post',
    data: data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmContractFileListAPI(data) {
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
export function crmContractNumAPI(data) {
  return request({
    url: 'crm/contract/count',
    method: 'post',
    data: data
  })
}

/**
 * 合同导出
 * @param {*} data
 */
export function crmContractExcelExportAPI(data) {
  return request({
    url: 'crm/contract/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmContractExcelAllExportAPI(data) {
  return request({
    url: 'crm/contract/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回访
 * @param {*} data
 */
export function crmContractQueryVisitAPI(data) {
  return request({
    url: 'crm/visit/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * @param {*} data
 */
export function crmContractQueryListByProductIdAPI(data) {
  return request({
    url: 'bi/product/listProduct',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
