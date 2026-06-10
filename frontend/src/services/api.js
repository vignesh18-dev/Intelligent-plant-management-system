import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://plant-management-app-0jp3.onrender.com",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;