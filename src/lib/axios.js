import axios from "axios";
import { getToken, clearToken } from "./auth";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isAuth = /\/auth\/(login|token)(\/|$)/.test(url);
  const t = getToken();
  if (t && !isAuth) {
    config.headers.Authorization = `Bearer ${t}`;
  } else {
    if (config.headers && "Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";

    if (status === 401 && (/\/v1\/auth\//.test(url) || /\/v1\/admins\//.test(url))) {
      clearToken();
    }
    
    return Promise.reject(err);
  }
);

export default api;
