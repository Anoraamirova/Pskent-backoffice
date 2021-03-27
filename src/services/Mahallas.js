import API, {
  execute
} from './Api'

export default {
  getMahallas: () => execute(API().get('mahallas')),
  postMahalla: (data) => execute(API().post('mahallas', data)),
  deleteMahalla: (id) => execute(API().delete(`mahallas/${id}`)),
  unArchiveMahalla: (id) => execute(API().post(`mahallas/${id}/restore`)),
  getArchivedMahalla: () => execute(API().get('mahallas?deleted=true'))
  // getRequests: (page, size) => execute(API().get(`mahallas?page=${page}&size=${size}`)),
  // hirequest: (id) => execute(API().put(`solvedrequest/${id}`)),
  // getStats: () => execute(API().get('stats/requests')),
  // getTime: () => execute(API().get('stats/time')),
  // getSingleRequest: id => execute(API().get('requests/' + id + '?lang=uz')),
  // getSortedRequests: (id, page, size) => execute(API().get(`requests?statusId=${id}&page=${page}&size=${size}`))

}
