import axios from "axios";
import Cookies from "js-cookie";

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

const ACCESS_KEY = "accessToken";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

// ─────────────────────────────────────────────────────────────
// 요청 인터셉터: access 토큰 있으면 Authorization 헤더 부착
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
  const r = await axios.post(
    `${BASE}/v1/auth/token/refresh/`,
    {},
    { withCredentials: true, headers: { Accept: "application/json" } }
  );
  const newAccess = r.data?.access;
  if (!newAccess) throw new Error("Refresh returned no access");
  Cookies.set(ACCESS_KEY, newAccess, { expires: 1 / 24 });
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
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─────────────────────────────────────────────────────────────
// 일반 로그인(이메일/비번)
export async function loginAndStore({ email, password, AUTH_BASE = "/v1/auth" }) {
  const r = await api.post(
    `${AUTH_BASE}/login/`,
    { email, password },
    { headers: { "Content-Type": "application/json", Accept: "application/json" } }
  );

  const access = r.data?.access;
  if (!access) throw new Error("Login must return access");

  Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
  return r.data;
}

export function logoutLocal() {
  Cookies.remove(ACCESS_KEY);
}

export function setAccessToken(access) {
  if (access) Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
}
