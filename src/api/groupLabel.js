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
  // 特殊参数处理
  const keys = ['major', 'class']
  const fields = keys.filter(item => data[item] !== null && data[item] !== undefined)
  if (fields.length > 0) {
    data.label_id = []
    fields.forEach(item => data.label_id.push(data[item]))
  }
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
