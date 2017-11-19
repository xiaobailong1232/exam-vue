import fetch from '@/utils/fetch'
// 列表
export function getGroupListFromApi(params) {
  return fetch({
    url: '/group',
    method: 'GET',
    params
  })
}
// 详情
export function getGroupItemFromApi(id) {
  return fetch({
    url: '/group/' + id,
    method: 'GET'
  })
}
// 创建
export function addGroupItemToApi(data) {
  console.log(222);
  return fetch({
    url: '/group',
    method: 'POST',
    data
  })
}
// 更新
export function updateGroupItemToApi(id, data) {
  return fetch({
    url: '/group/' + id,
    method: 'PUT',
    data
  })
}
// 删除
export function deleteGroupItemToApi(id) {
  return fetch({
    url: '/group/' + id,
    method: 'DELETE'
  })
}
// 恢复
export function restoreGroupItemToApi(id) {
  return fetch({
    url: '/group/' + id + '/restore',
    method: 'PATCH'
  })
}
