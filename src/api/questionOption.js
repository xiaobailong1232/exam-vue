import fetch from '@/utils/fetch'

// 父级URI
const baseUri = '/question'
const baseUriWithLine = baseUri + '/'
// 子级URI
const sonUri = '/option'
const sonUriWithLine = sonUri + '/'

// 列表
export function getQuestionOptionListFromApi(questionId, params) {
  return fetch({
    url: baseUriWithLine + questionId + '/' + sonUri,
    method: 'GET',
    params
  })
}

// 详情
export function getQuestionOptionsItemFromApi(questionId, id) {
  return fetch({
    url: baseUriWithLine + questionId + sonUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addQuestionOptionItemToApi(questionId, data) {
  return fetch({
    url: baseUriWithLine + questionId + sonUri,
    method: 'POST',
    data
  })
}

// 更新
export function updateQuestionOptionItemToApi(questionId, id, data) {
  return fetch({
    url: baseUriWithLine + questionId + sonUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteQuestionOptionItemToApi(questionId, id) {
  return fetch({
    url: baseUriWithLine + questionId + sonUriWithLine + id,
    method: 'DELETE'
  })
}
