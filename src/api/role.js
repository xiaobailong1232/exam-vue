import fetch from '@/utils/fetch'

// 列表
export function getRoleListFromApi(params) {
  return fetch({
    url: '/role',
    method: 'GET',
    params
  })
}

// 详情
export function getRoleItemFromApi(id) {
  return fetch({
    url: '/role/' + id,
    method: 'GET'
  })
}

// 创建
export function addRoleItemToApi(data) {
  return fetch({
    url: '/role',
    method: 'POST',
    data
  })
}

// 更新
export function updateRoleItemToApi(id, data) {
  return fetch({
    url: '/role/' + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteRoleItemToApi(id) {
  return fetch({
    url: '/role/' + id,
    method: 'DELETE'
  })
}
