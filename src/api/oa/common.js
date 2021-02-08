import request from '@/utils/request'

/**
 * 评论添加
 * @param {*} data
 */
export function setCommentAPI(data) {
  return request({
    url: 'work/taskcomment/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 日志评论添加
 * @param {*} data
 */
export function setjournalCommentAPI(data) {
  return request({
    url: 'oa/log/commentSave',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function deleteCommentAPI(data) {
  return request({
    url: 'work/taskcomment/delete',
    method: 'post',
    data: data
  })
}


export function queryCommentListAPI(data) {
  return request({
    url: 'oa/log/commentList',
    method: 'post',
    data
  })
}
