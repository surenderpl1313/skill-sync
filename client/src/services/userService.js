import api from "./api";

export const userService = {
  getMyProfile: () => api.get("/users/profile"),
  updateMyProfile: (data) => api.put("/users/profile", data),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: () => api.get("/users"),
};