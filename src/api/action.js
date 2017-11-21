import fetch from '@/utils/fetch'

const baseUri = '/action';
const baseUriWithLine = '/action/';

// 列表
export function getActionListFromApi(params) {
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}

// 详情
export function getActionItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addActionItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}

// 更新
export function updateActionItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteActionItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}
