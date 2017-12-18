import axios from 'axios'
import { Message, MessageBox, Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['admin-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
      * code为非20000是抛错 可结合自己业务进行修改
      */
    const res = response.data
    if (response.status === 200) {
      return response.data
    }
    // 创建成功
    else if (response.status === 201) {
      Message({
        message: '添加成功',
        type: 'success',
        duration: 5 * 1000
      })
      return response.data
    }
    // 操作成功
    else if (response.status === 204) {
      Message({
        message: '操作成功',
        type: 'success',
        duration: 5 * 1000
      })
      return response.data
    }
    else {
      return Promise.reject('error');
    }
  },
  error => {
    // 超时的错误
    if (!error.response) {
      Notification({
        title: '服务器错误',
        message: '出现了一个未预料的错误',
        type: 'error',
        duration: 3000
      });
      return Promise.reject(error);
    }
    // 身份验证
    if (error.response.status === 401) {
      Notification({
        title: '身份验证失效',
        message: '正在跳转登录页，请重新登录',
        type: 'error',
        duration: 1000
      });
  
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }
    // 权限错误
    else if (error.response.status === 403) {
      Notification({
        title: '未授权',
        message: error.response.data.message || '超出允许的权限范围',
        type: 'error',
        duration: 3000,
      });
      return Promise.reject(error);
    }
    // 未找到
    else if (error.response.status === 404) {
      Notification({
        title: '404 Not Found',
        message: error.response.data.message,
        type: 'error',
        duration: 3000,
      });
      return Promise.reject(error);
    }
    // 参数错误
    else if (error.response.status === 422) {
      const messages = [...Object.values(error.response.data.errors)];
      messages.forEach((item, index) => {
        Notification({
          title: '参数错误',
          message: item.join(''),
          type: 'error',
          offset: 80 * index
        });
      });
    
      return Promise.reject(error);
    }
    // 其余错误
    else {
      console.log('err' + error);// for debug
      Notification({
        title: error.response.status,
        message: '出现了一个未预料的错误',
        type: 'error'
      });
      return Promise.reject(error);
    }
  }
)

export default service
