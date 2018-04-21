import fetch from '@/utils/fetch'

// 父级URI
const baseUri = '/question'
const baseUriWithLine = baseUri + '/'

// 列表
export function getQuestionListFromApi(params) {
  // 特殊参数处理
  const keys = ['chapter', 'section', 'star', 'book', 'knowledge']
  const fields = keys.filter(item => params[item] !== null && params[item] !== undefined)
  if (fields.length > 0) {
    params.label_id = []
    fields.forEach(item => params.label_id.push(params[item]))
  }
  return fetch({
    url: baseUri,
    method: 'GET',
    params
  })
}

// 详情
export function getQuestionItemFromApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addQuestionItemToApi(data) {
  return fetch({
    url: baseUri,
    method: 'POST',
    data
  })
}

// 更新
export function updateQuestionItemToApi(id, data) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'PUT',
    data
  })
}

// 删除
export function deleteQuestionItemToApi(id) {
  return fetch({
    url: baseUriWithLine + id,
    method: 'DELETE'
  })
}

// 批量注册
export function batchAddQuestionsToApi(data) {
  return fetch({
    url: baseUriWithLine + 'batch-add',
    method: 'POST',
    data: {
      questions: data
    }
  })
}

// 批量注册
export function batchDeleteQuestionsToApi(data) {
  const ids = []
  data.forEach((item) => {
    ids.push(item.id)
  })
  return fetch({
    url: baseUriWithLine + 'batch-delete',
    method: 'DELETE',
    data: {
      ids: ids
    }
  })
}
