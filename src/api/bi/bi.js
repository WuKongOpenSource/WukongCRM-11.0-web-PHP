import request from '@/utils/request'

/**
 * 业绩目标完成情况
 * @param {*} data
 */
export function biAchievementStatisticsAPI(data) {
  return request({
    url: 'bi/achievement/statistics',
    method: 'post',
    data: data
  })
}

export function biAchievementStatisticsExportAPI(data) {
  return request({
    url: 'bi/achievement/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 产品销售情况统计
 * @param {*} data
 */
export function biProductStatisticsAPI(data) {
  return request({
    url: 'bi/product/statistics',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biProductStatisticsExportAPI(data) {
  return request({
    url: 'bi/product/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 销售漏斗
 * @param {*} data
 */
export function biBusinessFunnelAPI(data) {
  return request({
    url: 'bi/business/funnel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
