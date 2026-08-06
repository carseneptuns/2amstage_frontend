import api from "../lib/api";

const badgeService = {
  getMine: () => api.get("/badges/me"),
  saveOrder: (badges) => api.put("/badges/reorder", { badges }),
};

export default badgeService;
