import axios from "axios";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const publicApi = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

publicApi.interceptors.request.use((config) => {
  if (config.headers?.Authorization) delete config.headers.Authorization;
  config.withCredentials = false;
  return config;
});

export default publicApi;
