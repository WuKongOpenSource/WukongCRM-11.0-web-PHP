import request from '@/utils/request'

/**
 * 公告添加
 * @param {*} data
 */
export function noticeListAPI(data) {
  return request({
    url: 'oaAnnouncement/queryList',
    method: 'post',
    data: data
  })
}

/**
 * 公告添加或编辑
 * @param {*} data
 */
export function noticeAddOrUpateAPI(data) {
  var url = data.announcement_id ? 'update' : 'save'
  return request({
    url: 'oa/announcement/' + url,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 公告删除
 * @param {*} data
 */
export function noticeDeleteAPI(data) {
  return request({
    url: `oa/announcement/delete`,
    method: 'post',
    data
  })
}

/**
 * 公告详情
 * @param {*} data
 */
export function noticeQueryByIdAPI(data) {
  return request({
    url: `oa/announcement/read`,
    method: 'post',
    data
  })
}


/**
 * 公告设为已读
 * @param {*} data
 */
export function noticeIsReadAPI(data) {
  return request({
    url: 'oaAnnouncement/readAnnouncement',
    method: 'post',
    data: data
  })
}
