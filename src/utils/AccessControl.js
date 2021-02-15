import Vue from 'vue'
import store from '../store/index'

Vue.prototype.$access = (role) => {
  return role === store.state.user.roles[0].id
}
