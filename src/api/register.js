import fetch from '@/utils/fetch'

const sendUri = '/register/send'
const registerUri = '/register'

// 短信发送
export function sendSMS(phone) {
  return fetch({
    url: sendUri,
    method: 'POST',
    data: {
      phone
    }
  })
}

// 注册
export function register(data) {
  return fetch({
    url: registerUri,
    method: 'POST',
    data
  })
}
