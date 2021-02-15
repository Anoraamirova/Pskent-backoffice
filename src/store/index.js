import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || '',
    token: '' || localStorage.getItem('user_token'),
    loading: false,
    page: 1,
    isAvailable: false
    // socket: ''
  },
  mutations: {
    setUser (state, user, token) {
      // eslint-disable-next-line no-param-reassign
      state.user = user
      state.token = token
    },
    disconnect (state) {
      state.socket.disconnect()
    },
    set_isAvailable (state, payload) {
      state.isAvailable = payload
    },
    setloading (state, payload) {
      state.loading = payload
    },
    setPagination (state, payload) {
      state.page = payload
    },
    removeUser (state) {
      // eslint-disable-next-line no-param-reassign
      state.user = ''
      state.token = ''
    }
  },
  actions: {
    login ({ commit }, user) {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('user_token', user.token)
      commit('setUser', user, user.token)
    },
    logout ({ commit }) {
      // commit('disconnect')
      localStorage.removeItem('user')
      localStorage.removeItem('user_token')
      location.reload()
      commit('removeUser')
    }
  },
  modules: {
  },
  strict: true
})
