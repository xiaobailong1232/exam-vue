import fetch from '@/utils/fetch'

// 列表
export function getLabelListFromApi(params) {
  return fetch({
    url: '/label',
    method: 'GET',
    params
  })
}

// 详情
export function getLabelItemFromApi(id) {
  return fetch({
    url: '/label/' + id,
    method: 'GET'
  })
}

// 创建
export function addLabelItemToApi(data) {
  return fetch({
    url: '/label',
    method: 'POST',
    data
  })
}

// 更新
export function updateLabelItemToApi(id, data) {
  return fetch({
    url: '/label/' + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteLabelItemToApi(id) {
  return fetch({
    url: '/label/' + id,
    method: 'DELETE'
  })
}
