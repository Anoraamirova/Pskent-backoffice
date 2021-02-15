import API, { execute } from './Api'

export default {
  filterOrganization: (stDate, edDate, orgId, page, size) => execute(API().get(`requests?startDate=${stDate}&endDate=${edDate}&organizationId=${orgId}&page=${page}&size=${size}`)),
  getOrganizationUsers: (orgId, page, size) => execute(API().get(`users/?organizationId=${orgId}&page=${page}&size=${size}`)),
  editOrganization: (data, id) => execute(API().post(`organizations/${id}`, data)),
  getSortedOrganizations: () => execute(API().get('organizations/report')),
  postOrganization: data => execute(API().post('organizations', data)),
  getOrganization: () => execute(API().get('organizations')),
  getOrganizationWithHokims: () => execute(API().get('/organizations?all=true')),
  getOrgLength: () => execute(API().get('stats/orgs-cats'))

}
