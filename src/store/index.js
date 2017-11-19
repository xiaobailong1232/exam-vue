import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import role from './modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    role,
  },
  getters
})

export default store
