import api from "../lib/api";

const reportService = {
  getDashboard: () => api.get("/reports/dashboard"),
  getEventReport: (eventId) => api.get(`/reports/events/${eventId}`),
};

export default reportService;
