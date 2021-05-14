import request from '@/utils/request'

/**
 * 销售简报
 * @param {*} data
 */
export function crmQueryBulletinAPI(data) {
  return request({
    url: 'crm/index/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 销售简报-日志
 * @param {*} data
 */
export function crmQueryOneBulletinAPI(data) {
  return request({
    url: 'oa/log/oneBulletin',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 数据汇总
 * @param {*} data
 */
export function queryDataInfo(data) {
  return request({
    url: 'crm/index/queryDataInfo',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 销售简报列表
 */
export function crmIndexIndexListAPI(data) {
  return request({
    url: 'crm/index/indexList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 简报跟进记录数量
 * @param {*} data
 */
export function crmQueryRecordConuntAPI(data) {
  return request({
    url: 'crm/index/indexList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 业绩指标
 * @param {*} data
 */
export function crmIndexAchievementDataAPI(data) {
  return request({
    url: 'crm/index/achievementData',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 销售漏斗
 * @param {*} data
 */
export function crmIndexFunnelAPI(data) {
  return request({
    url: 'crm/index/funnel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 销售漏斗详情
 * @param {*} data
 */
export function crmInstrumentSellFunnelBusinessListAPI(data) {
  return request({
    url: 'crmInstrument/sellFunnelBusinessList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 销售趋势
 * @param {*} data
 */
export function crmIndexSaletrendAPI(data) {
  return request({
    url: 'crm/index/saletrend',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取简报 跟进记录信息
 * @param {*} data
 */
export function crmIndexGetRecordListAPI(data) {
  // data.label = data.crmType
  return request({
    url: 'crm/index/activityList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 获取简报记录信息
 * @param {*} data
 */
// export function crmIndexGetRecordActivityListAPI(data) {
//   // data.label = data.crmType
//   return request({
//     url: 'crm/index/activityList',
//     method: 'post',
//     data: data,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
/**
 * 遗忘提醒
 * @param {*} data
 */
export function crmIndexForgottenCustomerAPI(data) {
  return request({
    url: 'crm/index/forgottenCustomerCount',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 遗忘提醒详情
 * @param {*} data
 */
export function crmIndexForgottenCustomerListAPI(data) {
  return request({
    url: 'crm/index/forgottenCustomerPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 排行榜
 * @param {*} data
 */
export function crmIndexRankingAPI(data) {
  return request({
    url: 'crm/index/ranking',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 仪表盘排序
 * @param {*} data
 */
export function crmIndexSortAPI(data) {
  return request({
    url: 'crm/index/dashboard',
    method: 'post',
    data: data
  })
}

/**
 * 仪表盘排序设置
 * @param {*} data
 */
export function crmIndexSetSortAPI(data) {
  return request({
    url: 'crm/index/updateDashboard',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 逾期未联系客户接口
 * @param {*} data
 */
export function crmIndexUnContactCustomerAPI(data) {
  return request({
    url: 'crm/index/forgottenCustomerPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

//* **********************************
/**
 *
 * @param {*} data
 */
export function crmInstrumentExportRecordListAPI(data) {
  return request({
    url: '',
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
export function crmInstrumentImportRecordListAPI(data) {
  return request({
    url: '',
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
export function crmInstrumentDownloadRecordExcelAPI(data) {
  return request({
    url: '',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
