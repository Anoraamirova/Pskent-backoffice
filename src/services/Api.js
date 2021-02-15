/* eslint-disable eqeqeq */
import axios from 'axios'
import router from '../router'
import store from '../store'

export function execute (promise) {
  return new Promise((resolve, reject) => {
    promise.then((res) => {
      if (res.status == 200) {
        store.commit('set_isAvailable', true)
      } else {
        store.commit('set_isAvailable', false)
      }
      // console.log({ data: res.data, headers: res.headers })
      return resolve({ data: res.data, headers: res.headers })
    })
      .catch(err => {
        if (err) {
          if (err.response) {
            // eslint-disable-next-line eqeqeq
            if (err.response.status == 404) {
            }
            if (err.response.status == 502) {
              alert('Serverda muammo, qayta ulanib koring')
            }
            if (err.response.status == 401) {
              store.commit('set_isAvailable', false)
              reject(err.response)
              router.push('/pages/login')
            }
            reject((err.response))
          }
          reject(new Error(err))
        }
        reject(new Error('Check your request, and server'))
      })
  })
}

// const API = axios.create({
//   baseURL: process.env.VUE_APP_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('access_token')}`
//   }
// })

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user_token')}`
    }
  })
}
