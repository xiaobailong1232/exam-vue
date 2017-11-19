import fetch from '@/utils/fetch'

// 列表
export function getGroupLabelListFromApi(groupId, params) {
  return fetch({
    url: '/group/' + groupId + '/label',
    method: 'GET',
    params
  })
}

// 详情
export function getGroupLabelItemFromApi(groupId, id) {
  return fetch({
    url: '/group/' + groupId + '/label/' + id,
    method: 'GET'
  })
}

// 创建
export function addGroupLabelItemToApi(groupId, data) {
  return fetch({
    url: '/group/' + groupId + '/label',
    method: 'POST',
    data
  })
}

// 删除
export function deleteGroupLabelItemToApi(groupId, id) {
  return fetch({
    url: '/group/' + groupId + '/label/' + id,
    method: 'DELETE'
  })
}
