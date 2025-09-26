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

  // 공개용: 토큰 금지
  if (config.headers?.Authorization) delete config.headers.Authorization;

  // unsafe 메서드만 쿠키/CSRF 허용 (필요 없으면 이 블록 제거)
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
