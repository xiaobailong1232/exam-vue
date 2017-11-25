import fetch from '@/utils/fetch'

const baseUri = '/paper'
const baseUriWithLine = '/paper/'

// 列表
export function getPaperListFromApi(params) {
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}

// 详情
export function getPaperItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addPaperItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}

// 更新
export function updatePaperItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deletePaperItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}

// 删除
export function restorePaperItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id + '/restore',
    method: 'PATCH'
  })
}
