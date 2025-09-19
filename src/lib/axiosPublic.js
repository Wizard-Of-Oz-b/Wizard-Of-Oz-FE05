import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  withCredentials: false, 
});

publicApi.interceptors.request.use((config) => {
  if (config.headers) {
    delete config.headers.Authorization;
    delete config.headers.authorization;
    delete config.headers["X-CSRFToken"];
  }
  return config;
});

export default publicApi;
