import api from "../lib/api";

const orderService = {
  create: (payload) => api.post("/orders", payload),
  pay: (orderId) => api.post(`/orders/${orderId}/pay`),
  getMine: () => api.get("/orders/my"),
  resendEmail: (orderId) => api.post(`/orders/${orderId}/resend-email`),
};

export default orderService;
