import { api } from "../lib/api";

const pushService = {
  getVapidPublicKey: () => api.get("/push/vapid-public-key"),
  subscribe: (subscription) => api.post("/push/subscribe", subscription),
  unsubscribe: (endpoint) => api.post("/push/unsubscribe", { endpoint }),
};

export default pushService;
