import Vue from 'vue'
import './plugins/map'
import App from './App.vue'
import store from './store'
import router from './router'
import './utils/AccessControl'
import './mixins/BasicRequests'
import './assets/fonts/main.css'
import i18n from './locales/i18n.js'
import vuetify from './plugins/vuetify'
import velocity from 'velocity-animate'
import VueClipboard from 'vue-clipboard2'
import Notifications from 'vue-notification'
import VueNativeNotification from 'vue-native-notification'

Vue.config.productionTip = false
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})

Vue.use(VueClipboard)
Vue.use(require('vue-moment'))
Vue.use(Notifications, { velocity })
new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
