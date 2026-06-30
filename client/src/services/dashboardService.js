import api from "./api";

export const dashboardService = {
  getMyProjects: () => api.get("/dashboard/my-projects"),
  getJoinedProjects: () => api.get("/dashboard/joined-projects"),
  getMyRequests: () => api.get("/dashboard/my-requests"),
};