import api from "../lib/api";

const ticketService = {
  getMine: () => api.get("/tickets/my"),
  validate: (ticketCode) => api.post("/tickets/validate", { ticket_code: ticketCode }),
};

export default ticketService;
