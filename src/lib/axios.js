import axios from "axios";
import { getCookie, isUnsafe } from "./csrf";
import { getToken, setToken, getRefreshToken, setRefreshToken, clearToken } from "./auth";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const method = String(config.method || "get").toLowerCase();
  if (isUnsafe(method)) {
    const csrf = getCookie("csrftoken");
    if (csrf && !config.headers["X-CSRFToken"]) {
      config.headers["X-CSRFToken"] = csrf;
    }
  }
  // Authorization 헤더
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const r = await axios.post(
    `${BASE}/v1/auth/token/refresh/`,
    { refresh },
    { headers: { Accept: "application/json" } }
  );
  if (r.data?.access) {
    setToken(r.data.access);
    if (r.data.refresh) setRefreshToken(r.data.refresh);
    return r.data.access;
  }
  throw new Error("refresh failed");
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newAccess = await refreshAccessToken();
        original.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        clearToken();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
