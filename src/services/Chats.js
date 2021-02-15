import API, { execute } from './Api'

export default {
  getAll: (toUserId) => execute(API().get(`chats?toUserId=${toUserId}`)),
  getChats: (toUserId, page, size) => execute(API().get(`chats?toUserId=${toUserId}&page=${page}&size=${size}`)),
  postChat: (data) => execute(API().post('chats', data)),
  editChat: (data, id) => execute(API().put(`chats/${id}`, data)),
  deleteChat: (id) => execute(API().delete(`chats/${id}`)),
  getChatStats: () => execute(API().get('stats/chats'))
}
