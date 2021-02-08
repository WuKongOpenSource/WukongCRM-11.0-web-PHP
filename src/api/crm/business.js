import request from '@/utils/request'

/**
 * 新建商机
 * @param {*} data
 */
export function crmBusinessSaveAPI(data) {
  const url = data.id ? 'update' : 'save'
  return request({
    url: `crm/business/${url}`,
    method: 'post',
    data: data
  })
}

/**
 * 列表
 * @param {*} data
 */
export function crmBusinessIndexAPI(data) {
  return request({
    url: 'crm/business/index',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 * @param {*} data
 */
export function crmBusinessDeleteAPI(data) {
  return request({
    url: 'crm/business/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 商机状态组
 * @param {*} data
 */
export function crmBusinessStatusListAPI(data) {
  return request({
    url: 'crm/business/statusList',
    method: 'post',
    data: data
  })
}


/**
 * 商机下的状态组
 * @param {*} data
 */
export function crmBusinessStatusByIdAPI(data) {
  return request({
    url: `crm/business/statusList`,
    method: 'post',
    data: data
  })
}

/**
 * 详情
 * @param {*} data
 */
export function crmBusinessReadAPI(data) {
  return request({
    url: `crm/business/read`,
    method: 'post',
    data
  })
}

/**
 * 商机转移
 * @param {*} data
 */
export function crmBusinessTransferAPI(data) {
  return request({
    url: 'crm/business/transfer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 商机转移
 * @param {*} data
 */
export function crmBusinessAdvanceAPI(data) {
  return request({
    url: 'crm/business/advance',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 商机相关产品
 * @param {*} data
 */
export function crmBusinessProductAPI(data) {
  return request({
    url: 'crm/business/product',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 合同
 * @param {*} data
 */
export function crmBusinessQueryContractAPI(data) {
  return request({
    url: 'crm/contract/index',
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
export function crmBusinessSettingTeamSaveAPI(data) {
  return request({
    url: 'crm/setting/teamSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function crmBusinessSettingTeamDeleteAPI(data) {
  return request({
    url: 'crm/setting/teamSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function crmBusinessTeamMembersAPI(data) {
  return request({
    url: `crm/setting/team`,
    method: 'post',
    data
  })
}

export function crmBusinessUpdateMembersAPI(data) {
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
export function crmBusinessExitTeamAPI(data) {
  return request({
    url: `crm/setting/quitTeam`,
    method: 'post',
    data
  })
}

/**
 * 商机关联联系人
 * @param {*} data
 */
export function crmBusinessRelateContactsAPI(data) {
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
 * 商机取消关联联系人
 * @param {*} data
 */
export function crmBusinessUnrelateContactsAPI(data) {
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
 * 商机下联系人
 * @param {*} data
 */
export function crmBusinessQueryContactsAPI(data) {
  return request({
    url: 'crm/contacts/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 设置首要联系人
 * @param {*} data
 *
 */
export function crmBusinessSetContactsAPI(data) {
  return request({
    url: 'crm/business/setPrimary',
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
export function crmBusinessFileListAPI(data) {
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
export function crmBusinessNumAPI(data) {
  return request({
    url: 'crm/business/count',
    method: 'post',
    data: data
  })
}

/**
 * 商机导出
 * @param {*} data
 */
export function crmBusinessExcelExportAPI(data) {
  return request({
    url: 'crm/business/excelExport',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmBusinessExcelAllExportAPI(data) {
  return request({
    url: 'crm/business/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标星
 * @param {*} data
 *
 */
export function crmBusinessStarAPI(data) {
  return request({
    url: `/crm/business/star`,
    method: 'post',
    data
  })
}
