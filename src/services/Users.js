import API, { execute } from './Api'

export default {
  createUser: (data) => execute(API().post('users', data)),
  updateUser: (data, id) => execute(API().post(`users/${id}`, data)),
  getUsersRoles: () => execute(API().get('roles')),
  setupPassword: (data) => execute(API().post('users/password', data))
}
