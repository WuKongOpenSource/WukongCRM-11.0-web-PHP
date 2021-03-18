import request from '@/utils/request'

/**
 * 我下属的任务列表
 * @param {*} data
 */
export function taskListAPI(data) {
  return request({
    url: 'oa/task/myTask',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 新增任务
 * @param {*} data
 */
export function setTaskAPI(data) {
  return request({
    url: `${data.work_id ? 'work' : 'oa'}/task/save`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// /**
//  * 删除任务
//  * @param {*} data
//  */
// export function deleteTaskAPI(data) {
//   return request({
//     url: 'task/deleteTask',
//     method: 'post',
//     data: data
//   })
// }

/**
 * 任务详情
 * @param {*} data
 */
export function detailsTaskAPI(data) {
  return request({
    url: `work/task/read`,
    method: 'post',
    data
  })
}


/**
 * 回收站任务详情
 * @param {*} data
 */
export function detailsTrashTaskAPI(data) {
  return request({
    url: 'work/task/read',
    method: 'post',
    data: data
  })
}

/**
 * 任务活动
 * @param {*} data
 */
export function queryLogTaskAPI(data) {
  return request({
    url: `work/task/readLoglist`,
    method: 'post',
    data
  })
}


/**
 * 编辑相关信息
 * @param {*} data
 */
export function editTaskRelationAPI(data) {
  return request({
    url: `${data.work_id ? 'work' : 'oa'}/task/update`,
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 删除相关信息
 * @param {*} data
 */
export function deleteTaskRelationAPI(data) {
  return request({
    url: 'oa/task/delrelation',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}




/**
 * 取消选择的标签 taskId  label
 * @param {*} data
 */
export function taskDeleteLabelAPI(data) {
  return request({
    url: 'oaTask/deleteWorkTaskLabel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 办公任务导出
 * @param {*} data
 */
export function taskOaExportAPI(data) {
  return request({
    url: 'oa/task/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

