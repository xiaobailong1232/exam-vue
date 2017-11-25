import fetch from '@/utils/fetch'

const baseUri = '/paper'
const baseUriWithLine = '/paper/'
const sonUri = '/question'
const sonUriWithLine = '/question/'

// 列表
export function getPaperQuestionListFromApi(paperId, params) {
  return fetch({
    url: baseUriWithLine + paperId + sonUri,
    method: 'GET',
    params
  })
}

// 详情
export function getPaperQuestionItemFromApi(paperId, id) {
  return fetch({
    url: baseUriWithLine + paperId + sonUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addPaperQuestionItemToApi(paperId, data) {
  return fetch({
    url: baseUriWithLine + paperId + sonUri,
    method: 'POST',
    data: {
      questions: data
    }
  })
}

// 更新
export function updatePaperQuestionItemToApi(paperId, id, data) {
  return fetch({
    url: baseUriWithLine + paperId + sonUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deletePaperQuestionItemToApi(paperId, id) {
  return fetch({
    url: baseUriWithLine + paperId + sonUriWithLine + id,
    method: 'DELETE'
  })
}
