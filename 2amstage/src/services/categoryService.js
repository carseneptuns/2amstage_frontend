import api from "../lib/api";

const categoryService = {
  getAll: (eventId) => api.get(`/events/${eventId}/categories`),
  create: (eventId, payload) => api.post(`/events/${eventId}/categories`, payload),
  update: (eventId, categoryId, payload) =>
    api.put(`/events/${eventId}/categories/${categoryId}`, payload),
  remove: (eventId, categoryId) =>
    api.delete(`/events/${eventId}/categories/${categoryId}`),
};

export default categoryService;
