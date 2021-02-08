import request from '@/utils/request'

/**
 *
 * 新建任务列表
 * @param {*} data
 */
export function workTaskClassSaveAPI(data) {
  return request({
    url: 'work/taskclass/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 删除任务
 * @param {*} data
 */
export function workTaskDeleteAPI(data) {
  return request({
    url: `work/task/delete`,
    method: 'post',
    data
  })
}

/**
 *
 * 编辑任务列表
 * @param {*} data
 */
export function workTaskClassUpateAPI(data) {
  return request({
    url: 'work/taskclass/rename',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 新建任务
 * 同 setTaskAPI
 * @param {*} data
 */
export function workTaskSaveAPI(data) {
  return request({
    url: 'work/tasklable/index',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 完成任务状态
 * @param {*} data
 */
export function workTaskStatusSetAPI(data) {
  return request({
    url: 'work/task/taskOver',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 完成子任务状态
 * @param {*} data
 */
export function workTaskChildStatusSetAPI(data) {
  return request({
    url: 'work/task/taskOver',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 编辑任务标题
 * @param {*} data
 */
export function workTaskTitleSetAPI(data) {
  return request({
    url: 'work/task/updateName',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 编辑任务描述
 * @param {*} data
 */
export function workTaskDescriptionSetAPI(data) {
  return request({
    url: 'work/task/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 分配任务（负责人）
 * @param {*} data
 */
export function workTaskMainUserSetAPI(data) {
  return request({
    url: 'work/task/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 设置任务时间
 * @param {*} data
 */
export function workTaskTimeSetAPI(data) {
  return request({
    url: 'work/task/updateStoptime',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 设置任务标签
 * @param {*} data
 */
export function workTaskLabelSetAPI(data) {
  return request({
    url: 'work/task/updateLable',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 添加任务参与人
 * @param {*} data
 */
export function workTaskOwnerUserSetAPI(data) {
  return request({
    url: 'work/task/updateOwner',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 添加任务参与人
 * @param {*} data
 */
export function workTaskOwnerUserDeleteAPI(data) {
  return request({
    url: 'work/task/delOwnerById',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 设置任务优先级
 * @param {*} data
 */
export function workTaskPrioritySetAPI(data) {
  return request({
    url: 'work/task/updatePriority',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 新建子任务
 * @param {*} data
 */
export function workSubTaskAddAPI(data) {
  return request({
    url: 'work/task/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 编辑子任务
 * @param {*} data
 */
export function workSubTaskUpdateAPI(data) {
  return request({
    url: 'work/task/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * 删除子任务
 * @param {*} data
 */
export function workSubTaskDeleteAPI(data) {
  return request({
    url: `work/task/delete`,
    method: 'post',
    data
  })
}


// /**
//  * 任务添加附件
//  * @param {*} data
//  */
// export function workTaskFileUploadAPI(data) {
//   var param = new FormData()
//   Object.keys(data).forEach(key => {
//     param.append(key, data[key])
//   })
//   return request({
//     url: 'workTask/uploadWorkTaskFile',
//     method: 'post',
//     data: param,
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
// }

// /**
//  *
//  * 任务删除附件
//  * @param {*} data
//  */
// export function workTaskFileDeleteAPI(data) {
//   return request({
//     url: 'oaTask/deleteWorkTaskFile',
//     method: 'post',
//     data: data,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     }
//   })
// }
