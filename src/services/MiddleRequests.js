import API, { execute } from './Api'

export default {
  assignTask: (id, data) => execute(API().post(`requests/${id}/assign`, data)),
  reAssignTask: (id, data) => execute(API().post(`requests/${id}/reassign`, data)),
  sendImage: (files) => execute(API().post('files', files)),
  finishTask: (id, data) => execute(API().post(`requests/${id}/solve`, data)),
  confirmTask: (id) => execute(API().post(`requests/${id}/close`)),
  rejectTask: (id) => execute(API().post(`/requests/${id}/reject`))
}
