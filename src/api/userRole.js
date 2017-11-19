import fetch from '@/utils/fetch'

// 列表
export function getUserRoleListFromApi(userId, params) {
  return fetch({
    url: '/user/' + userId + '/role',
    method: 'GET',
    params
  })
}

// 详情
export function getUserRoleItemFromApi(userId, id) {
  return fetch({
    url: '/user/' + userId + '/role/' + id,
    method: 'GET'
  })
}

// 创建
export function addUserRoleItemToApi(userId, data) {
  return fetch({
    url: '/user/' + userId + '/role',
    method: 'POST',
    data
  })
}

// 删除
export function deleteUserRoleItemToApi(userId, id) {
  return fetch({
    url: '/user/' + userId + '/role/' + id,
    method: 'DELETE'
  })
}
