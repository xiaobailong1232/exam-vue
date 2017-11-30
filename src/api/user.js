import fetch from '@/utils/fetch'
// 列表
export function getUserListFromApi(params) {
  return fetch({
    url: '/user',
    method: 'GET',
    params
  })
}
// 详情
export function getUserItemFromApi(id) {
  return fetch({
    url: '/user/' + id,
    method: 'GET'
  })
}
// 创建
export function addUserItemToApi(data) {
  return fetch({
    url: '/user',
    method: 'POST',
    data
  })
}
// 更新
export function updateUserItemToApi(id, data) {
  return fetch({
    url: '/user/' + id,
    method: 'PUT',
    data
  })
}
// 删除
export function deleteUserItemToApi(id) {
  return fetch({
    url: '/user/' + id,
    method: 'DELETE'
  })
}
// 恢复
export function restoreUserItemToApi(id) {
  return fetch({
    url: '/user/' + id + '/restore',
    method: 'PATCH'
  })
}

// 重置密码
export function resetUserPasswordToApi(id, password) {
  return fetch({
    url: '/user/' + id + '/reset',
    method: 'PATCH',
    data: {
      password
    }
  })
}

// 批量注册
export function batchRegister(group_id, users) {
  return fetch({
    url: '/user/batch-register',
    method: 'POST',
    data: {
      group_id,
      users
    }
  })
}
