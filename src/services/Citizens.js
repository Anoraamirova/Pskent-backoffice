import API, { execute } from './Api'

export default {
  getCitizens: (page, size) => execute(API().get(`citizens?page=${page}&size=${size}`))
}
