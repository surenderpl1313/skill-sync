import api from "./api";

export const requestService = {
  send: (projectId, message) =>
    api.post(`/projects/${projectId}/request`, { message }),
  getForProject: (projectId) =>
    api.get(`/projects/${projectId}/requests`),
  accept: (requestId) =>
    api.put(`/requests/${requestId}/accept`),
  reject: (requestId) =>
    api.put(`/requests/${requestId}/reject`),
};