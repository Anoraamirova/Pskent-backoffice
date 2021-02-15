import API, { execute } from './Api'

export default {
  getToken: userData => execute(API().post('auth/login', userData))
}
