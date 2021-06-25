import request from '@/utils/request'

/**
 * 归档任务列表
 * @param {*} data
 */
export function workTaskArchListAPI(data) {
  return request({
    url: `work/task/archList`,
    method: 'post',
    data
  })
}

/**
 * 项目详情
 * @param {*} data
 */
export function workWorkReadAPI(data) {
  return request({
    url: 'work/work/read',
    method: 'post',
    data: data
  })
}

/**
 * 项目删除
 * @param {*} data
 */
export function workWorkDeleteAPI(data) {
  return request({
    url: `work/work/delete`,
    method: 'post',
    data
  })
}

/**
 * 新建项目
 * @param {*} data
 */
export function workWorkSaveAPI(data) {
  return request({
    url: 'work/work/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 恢复项目
 * @param {*} data
 */
export function workWorkArRecoverAPI(data) {
  return request({
    url: 'work/work/arRecover',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 编辑项目
 * @param {*} data
 */
export function workWorkUpdateAPI(data) {
  return request({
    url: 'work/work/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 * 归档项目
 * @param {*} data
 */
export function workWorkArchiveAPI(data) {
  return request({
    url: 'work/work/archive',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 退出项目
 * @param {*} data
 */
export function workWorkLeaveAPI(data) {
  return request({
    url: `work/work/leave`,
    method: 'post',
    data
  })
}

/**
 * 任务板列表
 * @param {*} data
 */
export function workTaskIndexAPI(data) {
  return request({
    url: 'work/task/index',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 任务板列表
 * @param {*} data
 */
export function workTaskOwnerIndexAPI(data) {
  return request({
    url: 'work/task/ownerTaskList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
// /**
//  * 设置任务类别 改为 saveWorkTaskClass
//  * @param {*} data
//  */
// export function workTaskClassSetAPI(data) {
//   return request({
//     url: 'task/setTaskClass',
//     method: 'post',
//     data: data
//   })
// }

/**
 * 分类删除
 * @param {*} data
 */
export function workTaskclassDeleteAPI(data) {
  return request({
    url: 'work/taskclass/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取附件列表
 * @param {*} data
 */
export function workWorkFileListAPI(data) {
  return request({
    url: 'work/work/fileList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 项目 -- 成员列表
 * @param {*} data
 */
export function workWorkOwnerListAPI(data) {
  return request({
    url: 'work/work/ownerList',
    method: 'post',
    data
  })
}

/**
 * 项目 -- 成员删除
 * @param {*} data
 */
export function workWorkOwnerDelAPI(data) {
  return request({
    url: 'work/work/ownerDel',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 项目 -- 归档已完成任务
 * @param {*} data
 */
export function workTaskArchiveTaskAPI(data) {
  return request({
    url: `work/task/archiveTask`,
    method: 'post',
    data
  })
}

/**
 * 项目 -- 归档负责人已完成任务
 * @param {*} data
 */
export function workTaskArchiveOwnerTaskAPI(data) {
  return request({
    url: 'work/task/archiveTask',
    method: 'post',
    data: data
  })
}

/**
 * 拖拽改变分类
 * @param {*} data
 */
export function workTaskUpdateOrderAPI(data) {
  return request({
    url: 'work/task/updateOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 拖拽改变分类列表
 * @param {*} data
 */
export function workTaskUpdateClassOrderAPI(data) {
  return request({
    url: 'work/task/updateClassOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目成员添加角色
 * @param {*} data
 */
export function workWorkAddUserGroupAPI(data) {
  return request({
    url: 'work/work/ownerAdd',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目成员角色列表
 * @param {*} data
 */
export function workWorkGroupListAPI(data) {
  return request({
    url: 'work/work/groupList',
    method: 'post',
    data: data
  })
}

/**
 * 项目收藏
 * @param {*} data
 */
export function workWorkCollectAPI(data) {
  return request({
    url: `work/work/follow`,
    method: 'post',
    data
  })
}

/**
 * 修改标签排序
 * @param {*} data
 */
export function workupdateWorkOrderAPI(data) {
  return request({
    url: 'work/work/updateWorkOrder',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 项目任务导出
 * @param {*} data
 */
export function workTaskExportAPI(data) {
  return request({
    url: 'work/task/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 获取导入模板
 * @param {*} data
 */
export function workDownloadExcelAPI(data) {
  return request({
    url: 'work/task/excelDownload',
    method: 'get',
    data: data,
    responseType: 'blob'
  })
}

/**
 * 项目任务导入
 * @param {*} data
 */
export function workExcelImportAPI(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'work/task/excelImport',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 项目任务下载错误模板
 * @param {*} data
 */
export function workDownloadErrorExcelAPI(data) {
  return request({
    url: 'admin/file/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
/**
 * 项目成员添加+设置角色
 * @param {*} data
 */
export function workWorkAddUserSetRoleGroupAPI(data) {
  return request({
    url: 'work/work/addUserGroup',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// /**
//  * 项目成员权限列表
//  * @param {*} data
//  */
// export function (data) {
//   return request({
//     url: 'work/work/addUserGroup',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data: data
//   })
// }

