import request from '@/utils/request'

/**
 * 员工客户总量分析
 */
export function biCustomerTotalAPI(data) {
  return request({
    url: 'bi/customer/total',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerTotalListAPI(data) {
  return request({
    url: 'bi/customer/statistics',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerTotalListExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工客户跟进次数分析
 * @param {*} data
 */
export function biCustomerRecordTimesAPI(data) {
  return request({
    url: 'bi/customer/recordTimes',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工客户跟进次数分析 具体员工列表
 * @param {*} data
 */
export function biCustomerRecordListAPI(data) {
  return request({
    url: 'bi/customer/recordList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerRecordListExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工跟进方式分析
 * @param {*} data
 */
export function biCustomerRecordModeAPI(data) {
  return request({
    url: 'bi/customer/recordMode',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerRecordModeExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 客户转化率分析具体数据
 * @param {*} data
 */
export function biCustomerConversionInfoAPI(data) {
  return request({
    url: 'bi/customer/conversionInfo',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 客户转化率分析
 * @param {*} data
 */
export function biCustomerConversionAPI(data) {
  return request({
    url: 'bi/customer/conversion',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 公海客户分析
 * @param {*} data
 */
export function biCustomerPoolAPI(data) {
  return request({
    url: 'bi/customer/pool',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 公海客户分析
 * @param {*} data
 */
export function biCustomerPoolListAPI(data) {
  return request({
    url: 'bi/customer/poolList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerPoolListExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工客户成交周期
 * @param {*} data
 */
export function biCustomerUserCycleAPI(data) {
  return request({
    url: 'bi/customer/userCycle',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerUserCycleExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function employeeCycleInfoAPI(data) {
  return request({
    url: 'bi/customer/userCycleList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 地区成交周期
 * @param {*} data
 */
export function biCustomerAddressCycleAPI(data) {
  return request({
    url: 'bi/customer/addressCycle',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerAddressCycleExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 产品成交周期
 * @param {*} data
 */
export function biCustomerProductCycleAPI(data) {
  return request({
    url: 'bi/customer/productCycle',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerProductCycleExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工客户满意度分析
 * @param {*} data
 */
export function biCustomerSatisfactionTableAPI(data) {
  return request({
    url: 'bi/customer/customerSatisfaction',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerSatisfactionTableExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 员工客户满意度分析
 * @param {*} data
 */
export function biCustomerProductSatisfactionTableAPI(data) {
  return request({
    url: 'bi/customer/productSatisfaction',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function biCustomerProductSatisfactionExportAPI(data) {
  return request({
    url: 'bi/customer/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
