import api from "../lib/api";

const eventService = {
  // Public
  getAll: () => api.get("/events"),
  getById: (id) => api.get(`/events/${id}`),

  // Organizer / super_admin
  getMine: () => api.get("/events/mine"),

  create: (formData) =>
    api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    api.put(`/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id) => api.delete(`/events/${id}`),

  // Builds a multipart FormData from a plain event payload object.
  // `poster` should be a File instance or omitted to keep existing poster.
  toFormData: (payload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (key === "poster") {
        if (value instanceof File) fd.append("poster", value);
        return;
      }
      if (key === "zone_mapping" && typeof value === "object") {
        fd.append("zone_mapping", JSON.stringify(value));
        return;
      }
      fd.append(key, value);
    });
    return fd;
  },
};

export default eventService;
