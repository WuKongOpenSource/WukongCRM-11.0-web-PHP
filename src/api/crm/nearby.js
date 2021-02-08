import request from '@/utils/request'

/**
 * 地图查询接口
 * @param {*} data
 */
export function crmCrmCustomerNearbyCustomerAPI(data) {
  return request({
    url: 'crm/customer/nearby',
    method: 'post',
    data: data
  })
}
