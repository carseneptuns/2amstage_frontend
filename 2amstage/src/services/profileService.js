import api from "../lib/api";

const profileService = {
  getMine: () => api.get("/profile/me"),
  getByUsername: (username) => api.get(`/profile/${username}`),
  search: (q) => api.get("/profile/search", { params: { q } }),
  update: (formData) =>
    api.put("/profile/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default profileService;
