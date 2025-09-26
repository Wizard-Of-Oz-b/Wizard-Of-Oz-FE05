import axios from "axios";
import { getToken, clearToken } from "./auth";
import { getCookie, isUnsafe } from "./csrf";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

const AUTH_PATH_RE = /\/auth\/(login|token(?:\/(refresh|verify))?)(\/|$)/;
const AUTH_ZONE_401_RE = /\/v1\/auth\/|\/v1\/admin(?:s)?\//;

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const method = String(config.method || "get").toLowerCase();
  const isAuthPath = AUTH_PATH_RE.test(url);

  const forceNoAuth =
    config.noAuth === true ||
    String(config.headers?.["X-No-Auth"] || "").toLowerCase() === "true";

  // 토큰
  config.headers = config.headers || {};
  const token = getToken?.();
  const shouldAttachToken = !!token && !isAuthPath && !forceNoAuth;

  if (shouldAttachToken) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if ("Authorization" in config.headers) delete config.headers.Authorization;
    if (forceNoAuth) config.withCredentials = false;
  }

  // CSRF (unsafe 메서드에만)
  if (isUnsafe(method)) {
    const csrf = getCookie("csrftoken");
    if (csrf && !config.headers["X-CSRFToken"]) {
      config.headers["X-CSRFToken"] = csrf;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";
    if (status === 401 && AUTH_ZONE_401_RE.test(url)) {
      try { clearToken?.(); } catch {}
    }
    return Promise.reject(err);
  }
);

export default api;
