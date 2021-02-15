import API, { execute } from './Api'

export default {
  getRoles: () => execute(API().get('roles'))
}
