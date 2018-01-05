import {
  getRoleListFromApi,
  addRoleItemToApi,
  updateRoleItemToApi,
  deleteRoleItemToApi
} from '@/api/role'

const role = {
  state: {
    list: []
  },
  mutations: {
    SET_LIST: (state, data) => {
      state.list = data
    },
    PUSH_LIST: (state, data) => {
      state.list.push(data)
    },
    UPDATE_LIST: (state, params) => {
      state.list.forEach((item, key) => {
        if (params.id === item.id) {
          for (let index in params.data) {
            item[index] = params.data[index]
          }
        }
      })
    },
    REMOVE_LIST: (state, id) => {
      state.list.forEach((item, key) => {
        if (item.id === id) {
          state.list.splice(key, 1)
        }
      })
    }
  },
  actions: {
    // 读取列表
    fetchRoleList({ commit }) {
      return new Promise((resolve, reject) => {
        return getRoleListFromApi().then(response => {
          commit('SET_LIST', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增
    addRoleItem({ commit }, data) {
      return new Promise((resolve, reject) => {
        return addRoleItemToApi(data).then(response => {
          commit('PUSH_LIST', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除
    deleteRoleItem({ commit }, params) {
      return new Promise((resolve, reject) => {
        return deleteRoleItemToApi(params.id).then(response => {
          commit('REMOVE_LIST', params.id)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 更新
    updateRoleItem({ commit }, params) {
      return new Promise((resolve, reject) => {
        return updateRoleItemToApi(params.id, params.data).then(response => {
          commit('UPDATE_LIST', params)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default role
