import axios from "axios";
import Cookies from "js-cookie";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const ACCESS_KEY = "accessToken";
const REFRESH_FALLBACK_KEY = "refreshToken";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, 
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const access = Cookies.get(ACCESS_KEY);
  if (access) {
    config.headers["Authorization"] = `Bearer ${access}`;
  } else {
    delete config.headers?.Authorization;
  }
  return config;
});

async function doTokenRefresh() {
  const refresh = Cookies.get(REFRESH_FALLBACK_KEY);
  if (!refresh) throw new Error("No refresh token in client cookie");

  const r = await axios.post(
    `${BASE}/v1/auth/token/refresh/`,
    { refresh },
    { withCredentials: true, headers: { Accept: "application/json" } }
  );

  const newAccess = r.data?.access;
  const newRefresh = r.data?.refresh;

  if (!newAccess) throw new Error("Refresh returned no access");

  Cookies.set(ACCESS_KEY, newAccess, { expires: 1 / 24 });
  if (newRefresh) Cookies.set(REFRESH_FALLBACK_KEY, newRefresh, { expires: 7 });

  return newAccess;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newAccess = await doTokenRefresh();
        original.headers = original.headers || {};
        original.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        Cookies.remove(ACCESS_KEY);
        Cookies.remove(REFRESH_FALLBACK_KEY);
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export async function loginAndStore({ email, password, AUTH_BASE = "/v1/auth" }) {
  const r = await api.post(`${AUTH_BASE}/login/`, { email, password }, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  const access = r.data?.access;
  const refresh = r.data?.refresh;

  if (!access || !refresh) throw new Error("Login must return access/refresh");

  Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
  Cookies.set(REFRESH_FALLBACK_KEY, refresh, { expires: 7 });

  return r.data;
}

export function logoutLocal() {
  Cookies.remove(ACCESS_KEY);
  Cookies.remove(REFRESH_FALLBACK_KEY);
}
