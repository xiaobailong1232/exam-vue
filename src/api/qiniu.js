import request from '@/utils/fetch'

export function getToken() {
  return request({
    url: '/qiniu/token', // 假地址 自行替换
    method: 'get'
  })
}

export function upload() {
  return null
}
