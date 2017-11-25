import fetch from '@/utils/fetch'

const baseUri = '/group'
const baseUriWithLine = '/group/'
const sonUri = '/member'
const sonUriWithLine = '/member/'

// 列表
export function getGroupMemberListFromApi(groupId, params) {
  return fetch({
    url: baseUriWithLine + groupId + sonUri,
    method: 'GET',
    params
  })
}

// 详情
export function getGroupMemberItemFromApi(groupId, id) {
  return fetch({
    url: baseUriWithLine + groupId + sonUriWithLine + id,
    method: 'GET'
  })
}

// 创建
export function addGroupMemberItemToApi(groupId, data) {
  return fetch({
    url: baseUriWithLine + groupId + sonUri,
    method: 'POST',
    data
  })
}

// 删除
export function deleteGroupMemberItemToApi(groupId, id) {
  return fetch({
    url: baseUriWithLine + groupId + sonUriWithLine + id,
    method: 'DELETE'
  })
}
