import request from '@/utils/request'

/**
 *crm 自定义字段的添加
 * @param {*} data
 */
export function filedGetFieldAPI(data) {
  // const label = data.label
  // let url
  // if (label === 10) {
  //   url = '/oaExamineField/queryField/' + data.id
  // } else {
  //   url = crmTypeModel.labelToType[label] + '/field/' + (data.id ? data.id : '')
  // }
  return request({
    url: 'admin/field/getField',
    method: 'post',
    data
  })
}

/**
 * 详情页基本信息
 * data 会包含poolId 需保留
 * @param {*} data
 */
export function filedGetInformationAPI(data) {
  return request({
    url: `admin/field/getField`,
    method: 'post',
    data
  })
}
/**
 * 详情页系统信息
 *
 * @param {*} data
 */
export function filedGetSystemAPI(data) {
  return request({
    url: `crm/${data.crmType}/system`,
    method: 'post',
    data
  })
}


/**
 * 表头
 * @param {*} data
 */
export function filedGetTableFieldAPI(data) {
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
 * 基本信息编辑
 * @param {*} data
 */
export function filedUpdateTableFieldAPI(data) {
  // const url = {
  //   1: 'crmLeads',
  //   2: 'crmCustomer',
  //   3: 'crmContacts',
  //   4: 'crmProduct',
  //   5: 'crmBusiness',
  //   6: 'crmContract',
  //   7: 'crmReceivables',
  //   17: 'crmReturnVisit'
  // }[data.label]
  return request({
    url: `crm/common/quickEdit`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 公海表头
 * @param {*} data
 */
export function filedGetPoolTableFieldAPI(data) {
  return request({
    url: 'crm/customerPool/field',
    method: 'post',
    data: data
  })
}

/**
 * 自定义字段验重
 * @param {*} data
 */
export function filedValidatesAPI(data) {
  return request({
    url: 'admin/field/validates',
    method: 'post',
    data: data
  })
}

/**
 * 自定义字段(高级筛选)
 * @param {*} data
 */
export function filterIndexfieldsAPI(data) {
  return request({
    url: 'admin/index/fields',
    method: 'post',
    data: data
  })
}

/**
 * 公海自定义字段(高级筛选)
 * @param {*} data
 */
export function filterIndexPoolfieldsAPI(data) {
  return request({
    url: 'admin/index/fields',
    method: 'post',
    data: data
  })
}

/**
 * 场景列表
 * @param {*} data
 */
export function crmSceneIndexAPI(data) {
  return request({
    url: 'admin/scene/index',
    method: 'post',
    data: data
  })
}

/**
 * 场景设置列表
 * @param {*} data
 */
export function crmSceneSetIndexAPI(data) {
  return request({
    url: 'admin/scene/index',
    method: 'post',
    data: data
  })
}

/**
 * 场景创建
 * @param {*} data
 */
export function crmSceneSaveAPI(data) {
  return request({
    url: 'admin/scene/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 场景编辑
 * @param {*} data
 */
export function crmSceneUpdateAPI(data) {
  return request({
    url: 'admin/scene/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 场景默认
 * @param {*} data
 */
export function crmSceneDefaultsAPI(data) {
  return request({
    url: 'admin/scene/defaults',
    method: 'post',
    data: data
  })
}

/**
 * 场景删除
 * @param {*} data
 */
export function crmSceneDeleteAPI(data) {
  return request({
    url: 'admin/scene/delete',
    method: 'post',
    data: data
  })
}

/**
 * 场景排序
 * @param {*} data
 */
export function crmSceneSortAPI(data) {
  return request({
    url: 'admin/scene/sort',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 列表字段排序数据
 * @param {*} data
 */
export function crmFieldConfigAPIIndexAPI(data) {
  return request({
    url: 'admin/field/configIndex',
    method: 'post',
    data: data
  })
}

/**
 * 公海列表字段排序数据
 * @param {*} data
 */
export function crmPoolFieldConfigIndexAPI(data) {
  return request({
    url: 'crm/customerPool/fieldConfig',
    method: 'post',
    data: data
  })
}

/**
 * 列表排序编辑
 * @param {*} data
 */
export function crmFieldConfigAPI(data) {
  return request({
    url: 'admin/field/config',
    method: 'post',
    data: data
  })
}

/**
 * 公海列表排序编辑
 * @param {*} data
 */
export function crmPoolFieldConfigAPI(data) {
  return request({
    url: 'crm/customerPool/setFieldConfig',
    method: 'post',
    data: data
  })
}

/**
 * 列表宽度设置
 * @param {*} data
 */
export function crmFieldColumnWidthAPI(data) {
  return request({
    url: 'admin/field/columnWidth',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 公海 列表宽度设置
 * @param {*} data
 */
export function crmPoolFieldColumnWidthAPI(data) {
  return request({
    url: 'crm/customerPool/setFieldWidth',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 操作记录
 * @param {*} data
 */
export function crmIndexFieldRecordAPI(data) {
  return request({
    url: 'admin/index/fieldRecord',
    method: 'post',
    data: data
  })
}

/**
 * 客户管理下 合同回款的待审批
 * @param {*} data
 */
export function crmExamineMyExamineAPI(data) {
  return request({
    url: 'oa/examine/myExamine',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 查询活动分页列表
 * @param {*} data
 */
export function crmActivityListAPI(data) {
  return request({
    url: 'crm/activity/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除跟进记录
 * @param {*} data
 */
export function crmActivityDeleteAPI(data) {
  return request({
    url: `crm/activity/delete`,
    method: 'post',
    data
  })
}

/**
 * 删除外勤签到
 * @param {*} data
 */
export function crmActivityOutworkSignDeleteAPI(data) {
  return request({
    url: 'crmActivity/deleteOutworkSign',
    method: 'post',
    data: data
  })
}

/**
 * 添加跟进记录
 * @param {*} data
 */
export function crmActivityAddAPI(data) {
  return request({
    url: 'crm/activity/save',
    method: 'post',
    data: data
  })
}

/**
 * 编辑跟进记录
 * @param {*} data
 */
export function crmActivityUpdateAPI(data) {
  return request({
    url: 'crm/activity/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 查看当前导入数量
 * @param {*} data
 */
export function crmQueryImportNumAPI(data) {
  return request({
    url: 'admin/index/importNum',
    method: 'post',
    data: data
  })
}

/**
 * 查询导入结果
 * @param {*} data
 */
export function crmQueryImportInfoAPI(data) {
  return request({
    url: 'admin/index/importInfo',
    method: 'post',
    data: data
  })
}

/**
 * 查看错误数据接口
 * @param {*} data
 */
export function crmDownImportErrorAPI(data) {
  return request({
    url: 'admin/file/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 查询跟进记录常用语
 * @param {*} data
 */
export function sysConfigQueryPhraseAPI(data) {
  return request({
    url: 'crm/activity/getPhrase',
    method: 'post',
    data: data
  })
}

/**
 * 设置跟进记录常用语
 * @param {*} data
 */
export function sysConfigSetPhraseAPI(data) {
  return request({
    url: 'crm/activity/setPhrase',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// admin/examineFlow/stepList 审批流程
export function examineFlowStepListAPI(data) {
  return request({
    url: 'admin/examine_flow/stepList',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
