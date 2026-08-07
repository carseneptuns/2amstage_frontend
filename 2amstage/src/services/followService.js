import api from "../lib/api";

const followService = {
  follow: (userId) => api.post(`/follows/${userId}`),
  unfollow: (userId) => api.delete(`/follows/${userId}`),
  status: (userId) => api.get(`/follows/status/${userId}`),
  followers: (userId) => api.get(`/follows/${userId}/followers`),
  following: (userId) => api.get(`/follows/${userId}/following`),
};

export default followService;
