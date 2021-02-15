import API, {
  execute
} from './Api'

export default {
  getCategories: () => execute(API().get('categories')),
  postCategory: (data) => execute(API().post('categories', data)),
  deleteCategory: (id) => execute(API().delete(`categories/${id}`)),
  unArchiveCategory: (id) => execute(API().post(`categories/${id}/restore`)),
  getArchivedCategories: () => execute(API().get('categories?deleted=true')),
  getRequests: (page, size) => execute(API().get(`requests?page=${page}&size=${size}`)),
  hirequest: (id) => execute(API().put(`solvedrequest/${id}`)),
  getStats: () => execute(API().get('stats/requests')),
  getTime: () => execute(API().get('stats/time')),
  getSingleRequest: id => execute(API().get('requests/' + id + '?lang=uz')),
  getSortedRequests: (id, page, size) => execute(API().get(`requests?statusId=${id}&page=${page}&size=${size}`))

}
