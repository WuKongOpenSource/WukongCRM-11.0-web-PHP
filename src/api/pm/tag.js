import request from '@/utils/request'

/**
 * 标签左侧列表
 * @param {*} data
 */
export function workTasklableIndexAPI(data) {
  return request({
    url: 'work/tasklable/index',
    method: 'post',
    data: data
  })
}

/**
 * 单个标签详情
 * @param {*} data
 */
export function workTasklableReadAPI(data) {
  return request({
    url: `work/tasklable/read`,
    method: 'post',
    data
  })
}

/**
 * 标签删除
 * @param {*} data
 */
export function workTasklableDeleteAPI(data) {
  return request({
    url: 'work/tasklable/delete',
    method: 'post',
    data: data
  })
}

/**
 * 创建标签
 * @param {*} data
 */
export function workTasklableSaveAPI(data) {
  return request({
    url: 'work/tasklable/save',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标签编辑
 * @param {*} data
 */
export function workTasklableSetAPI(data) {
  return request({
    url: 'work/tasklable/update',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取项目及任务表
 * @param {*} data
 */
export function workTasklableGetWokListAPI(data) {
  return request({
    url: `work/tasklable/getWokList`,
    method: 'post',
    data
  })
}

/**
 * 修改标签排序
 * @param {*} data
 */
export function workTasklableUpdateOrderAPI(data) {
  return request({
    url: 'taskLabel/updateOrder',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
