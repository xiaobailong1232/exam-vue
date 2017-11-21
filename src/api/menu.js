import fetch from '@/utils/fetch'

const baseUri = '/menu';
const baseUriWithLine = '/menu/';

// 列表
export function getMenuListFromApi(params) {
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}

// 详情
export function getMenuItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addMenuItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}

// 更新
export function updateMenuItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteMenuItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}
