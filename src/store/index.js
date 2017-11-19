import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import role from './modules/role'
import label from './modules/label'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    role,
    label
  },
  getters
})

export default store
