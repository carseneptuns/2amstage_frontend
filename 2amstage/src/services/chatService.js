import api from "../lib/api";

const chatService = {
  startConversation: (userId) => api.post("/chat/conversations", { user_id: userId }),
  listConversations: () => api.get("/chat/conversations"),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, isi) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { isi }),
};

export default chatService;
