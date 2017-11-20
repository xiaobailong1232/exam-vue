import fetch from '@/utils/fetch'

// 父级URI
const baseUri = '/question'
const baseUriWithLine = baseUri + '/'
// 子级URI
const sonUri = '/label'
const sonUriWithLine = sonUri + '/'

// 列表
export function getQuestionLabelListFromApi(questionId, params) {
  return fetch({
    url: baseUriWithLine + questionId + sonUri,
    method: 'GET',
    params
  })
}

// 详情
export function getQuestionLabelItemFromApi(questionId, id) {
  return fetch({
    url: baseUriWithLine + questionId + sonUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addQuestionLabelItemToApi(questionId, data) {
  return fetch({
    url: baseUriWithLine + questionId + sonUri,
    method: 'POST',
    data
  })
}

// 删除
export function deleteQuestionLabelItemToApi(questionId, id) {
  return fetch({
    url: baseUriWithLine + questionId + sonUriWithLine + id,
    method: 'DELETE'
  })
}
