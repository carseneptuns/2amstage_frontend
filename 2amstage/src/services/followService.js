import api from "../lib/api";

const followService = {
  follow: (userId) => api.post(`/follows/${userId}`),
  unfollow: (userId) => api.delete(`/follows/${userId}`),
  status: (userId) => api.get(`/follows/status/${userId}`),
};

export default followService;
