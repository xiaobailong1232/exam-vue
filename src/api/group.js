import fetch from '@/utils/fetch'

const baseUri = '/group'
const baseUriWithLine = '/group/'

// 列表
export function getGroupListFromApi(params) {
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}
// 详情
export function getGroupItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}
// 创建
export function addGroupItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}
// 更新
export function updateGroupItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}
// 删除
export function deleteGroupItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}
// 恢复
export function restoreGroupItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id + '/restore',
    method: 'PATCH'
  })
}
