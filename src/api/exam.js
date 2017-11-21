import fetch from '@/utils/fetch'

const baseUri = '/exam'
const baseUriWithLine = '/exam/'

// 列表
export function getExamListFromApi(params) {
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}

// 详情
export function getExamItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addExamItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}

// 更新
export function updateExamItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteExamItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}
