import request from '@/utils/request'
let sysUrl = require('../setting/api-host').sysApiHost
// let sysAuthUrl = require('../setting/api-host').sysAuthApiHost
let webUrl = require('../setting/api-host').webApiHost
let loginUrl = require('../setting/api-host').loginApiHost

// ----------------------------- 系统管理 ------------------------ //
/**
 * 获取所有字典类别列表
 */
export function fetchTypeList() {
  return request({
    url: sysUrl + '/dict/type/list',
    method: 'post',
    data: {},
    headers: {
      'X-Route': '/sys/dict/type/list'
    }
  })
}
/**
 * 获取所有字典值列表
 */
export function fetchValueList() {
  return request({
    url: sysUrl + '/dict/value/list',
    method: 'post',
    data: {},
    headers: {
      'X-Route': '/sys/dict/value/list'
    }
  })
}

// 获取管理部门树列表
export function fetchGlbmList() {
  return request({
    url: sysUrl + '/dept/tree',
    method: 'post',
    data: {},
    headers: {
      'X-Route': '/sys/dept/tree'
    }
  })
}

/**
 * 获取系统参数配置表
 */
export function fetchSysList() {
  return request({
    url: sysUrl + '/config/list',
    method: 'post',
    data: {},
    headers: {
      'X-Route': '/sys/config/list'
    }
  })
}

/**
 * 用户登录
 * @param {String} params 用户名 密码
 */
export function login(username, password) {
  return request({
    url: loginUrl + '/in',
    method: 'post',
    data: {
      yhdh: username,
      mm: password
    }
  })
}

/**
 * 用户登出
 */
export function logout() {
  return request({
    url: loginUrl + '/out',
    method: 'get'
  })
}

/**
 * 修改密码
 */
export function updatePassword(data) {
  return request({
    url: sysUrl + '/user/updateMm',
    method: 'post',
    data: data,
    headers: {
      'X-Route': '/sys/user/updateMm'
    }
  })
}

/**
 * init
 */
export function init() {
  return request({
    url: sysUrl + '/cache/init',
    method: 'get',
    headers: {
      'X-Route': '/sys/cache/init'
    }
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(username) {
  return request({
    url: sysUrl + '/user/get/' + username,
    method: 'get',
    headers: {
      'X-Route': '/sys/user/get/' + username
    }
  })
}

/**
 * 获取菜单列表
 */
export function getAllMenus() {
  return request({
    url: webUrl + '/getModules',
    method: 'get',
    headers: {
      'X-Route': '/web/getModules'
    }
  })
}

/**
 * 部门数据清空缓存
 */
export function deptRefresh() {
  return request({
    url: sysUrl + '/dept/refresh',
    method: 'get',
    headers: {
      'X-Route': '/sys/dept/refresh'
    }
  })
}

/**
 * 参数数据清空缓存
 */
export function configRefresh() {
  return request({
    url: sysUrl + '/config/refresh',
    method: 'get',
    headers: {
      'X-Route': '/sys/config/refresh'
    }
  })
}

/**
 * 无token验证获取参数类型为公共参数集
 */
export function configByCsdm(csdm) {
  return request({
    url: sysUrl + `/config/get-by-csdm/${csdm}`,
    method: 'get',
    headers: {
      'X-Route': `/sys/config/get-by-csdm/${csdm}`
    }
  })
}

/**
 * 根据url的参数代码来获取对象
 */
export function configListPublic() {
  return request({
    url: sysUrl + '/config/list-public',
    method: 'post',
    data: {},
    headers: {
      'X-Route': '/sys/config/list-public'
    }
  })
}

/**
 * 字典数据清空缓存
 */
export function dictRefresh() {
  return request({
    url: sysUrl + '/dict/refresh',
    method: 'get',
    headers: {
      'X-Route': '/sys/dict/refresh'
    }
  })
}

/**
 * 文件下载
 */
export function downloadFiles(data) {
  return request({
    url: '/supervise_core/monSuperviseEvent/downLoadFile?wjlj=' + data.wjlj + '&wjmc=' + data.wjmc,
    method: 'get',
    responseType: 'blob'
  })
}
