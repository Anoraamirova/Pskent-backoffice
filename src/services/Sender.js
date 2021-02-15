import API, { execute } from './Api'

export default {
  getSenderProfile: (id) => execute(API().get(`stats/requests?citizenId=${id}`))
}
