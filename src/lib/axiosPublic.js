import axios from "axios";
import { getCookie, isUnsafe } from "./csrf";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const publicApi = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

publicApi.interceptors.request.use((config) => {
  const method = String(config.method || "get").toLowerCase();

  if (config.headers?.Authorization) delete config.headers.Authorization;

  if (isUnsafe(method)) {
    config.withCredentials = true;
    const csrf = getCookie("csrftoken");
    if (csrf) config.headers["X-CSRFToken"] = csrf;
  } else {
    config.withCredentials = false;
  }

  return config;
});

export default publicApi;