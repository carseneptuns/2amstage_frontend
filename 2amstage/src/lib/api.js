import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Root origin of the Flask backend (no trailing slash), e.g. http://localhost:5000
export const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://10.0.5.206:5000"
).replace(/\/$/, "");

// Turns a backend-relative path like "/static/uploads/x.jpg" into a full URL.
// Leaves already-absolute URLs untouched.
export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token invalid/expired — clear session so guards redirect to /login
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

// Normalizes Flask error payloads ({message: "..."}) into a readable string.
export function apiErrorMessage(err, fallback = "Terjadi kesalahan, coba lagi.") {
  return err?.response?.data?.message || err?.message || fallback;
}

export default api;
