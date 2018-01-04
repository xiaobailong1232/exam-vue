import {
  getLabelListFromApi,
  addLabelItemToApi,
  updateLabelItemToApi,
  deleteLabelItemToApi
} from '@/api/label'

const label = {
  state: {
    list: []
  },
  mutations: {
    SET_LIST: (state, data) => {
      state.list = data
    },
    PUSH_LIST: (state, data) => {
      state.list.push(data)
      // bug 去除
      state.list.splice(-1, 1)
    },
    UPDATE_LIST: (state, params) => {
      state.list.forEach((item, key) => {
        if (params.id === item.id) {
          for (const index in params.data) {
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
    fetchLabelList({ commit }) {
      return new Promise((resolve, reject) => {
        return getLabelListFromApi().then(response => {
          commit('SET_LIST', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增
    addLabelItem({ commit }, data) {
      return new Promise((resolve, reject) => {
        return addLabelItemToApi(data).then(response => {
          commit('PUSH_LIST', response.data)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除
    deleteLabelItem({ commit }, params) {
      return new Promise((resolve, reject) => {
        return deleteLabelItemToApi(params.id).then(response => {
          commit('REMOVE_LIST', params.id)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 更新
    updateLabelItem({ commit }, params) {
      return new Promise((resolve, reject) => {
        return updateLabelItemToApi(params.id, params.data).then(response => {
          commit('UPDATE_LIST', params)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default label
