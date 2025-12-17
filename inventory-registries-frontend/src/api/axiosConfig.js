import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  
});

api.interceptors.request.use((config) => {
  const token = btoa("admin:admin123");
  config.headers.Authorization = `Basic ${token}`;
  return config;
});

export default api;
