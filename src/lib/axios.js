import axios from "axios";
import { getToken, clearToken } from "./auth";

const ROOT = ((
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000"
).trim()).replace(/\/+$/, "");
const BASE = `${ROOT}/api`;

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

const AUTH_PATH_RE = /\/auth\/(login|token(?:\/(refresh|verify))?)(\/|$)/i;
const AUTH_ZONE_401_RE = /\/v1\/auth\/|\/v1\/admin(?:s)?\//i;

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const isAuthPath = AUTH_PATH_RE.test(url);

  const forceNoAuth =
    config.noAuth === true ||
    String(config.headers?.["X-No-Auth"] || "").toLowerCase() === "true";

  config.headers = config.headers || {};

  const token = typeof getToken === "function" ? getToken() : undefined;

  if (token && !isAuthPath && !forceNoAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if ("Authorization" in config.headers) {
      delete config.headers.Authorization;
    }
    if (forceNoAuth) {
      config.withCredentials = false;
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
      try {
        if (typeof clearToken === "function") clearToken();
      } catch {
        // ignore clearToken error
      }
    }
    return Promise.reject(err);
  }
);

export default api;