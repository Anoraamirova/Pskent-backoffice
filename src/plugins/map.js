import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    // key: 'AIzaSyCVi14ikRw6DoJE6ehUs8fRSRDkxxi7wCU',
    // key: 'AIzaSyA6XzGHNL_y9qe-rQCVmCpXCqr40o7CXQA',
    key: process.env.VUE_APP_GOOGLE_KEY,
    libraries: '3.26'
  },
  installComponents: true
})
