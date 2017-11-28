import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import lang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
// Qrcode
import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

Array.prototype.contains = function ( needle ) {
  for (let i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

Vue.use(ElementUI)
locale.use(lang)

Vue.config.productionTip = false

require('promise.prototype.finally').shim()

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
