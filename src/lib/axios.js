// import axios from "axios";
// import Cookies from "js-cookie";

// const REFRESH_KEY = "refreshToken";
// export function setRefreshToken(t) { if (t) Cookies.set(REFRESH_KEY, t, { expires: 7 }); }
// export function getRefreshToken() { return Cookies.get(REFRESH_KEY); }
// const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";

// const ACCESS_KEY = "accessToken";

// const api = axios.create({
//   baseURL: BASE,
//   withCredentials: true,
//   headers: { Accept: "application/json" },
//   timeout: 15000,
// });

// // ─────────────────────────────────────────────────────────────
// // 요청 인터셉터: access 토큰 있으면 Authorization 헤더 부착
// api.interceptors.request.use((config) => {
//   const access = Cookies.get(ACCESS_KEY);
//   if (access) {
//     config.headers["Authorization"] = `Bearer ${access}`;
//   } else {
//     delete config.headers?.Authorization;
//   }
//   return config;
// });

// async function doTokenRefresh() {
//   // const r = await axios.post(
//   //   `${BASE}/v1/auth/token/refresh/`,
//   //   {},
//   //   { withCredentials: true, headers: { Accept: "application/json" } }
//   // );
//   // const r = await api.post(
//   //   `/v1/auth/refresh/`,
//   //   {},
//   //   { withCredentials: true, headers: { Accept: "application/json" } }
//   // );
//   // const newAccess = r.data?.access;
//   // if (!newAccess) throw new Error("Refresh returned no access");
//   // Cookies.set(ACCESS_KEY, newAccess, { expires: 1 / 24 });
//   // return newAccess;
//   const refresh = getRefreshToken();
//   if (refresh) {
//     const r = await api.post(`/v1/auth/token/refresh/`, { refresh });
//     const newAccess = r.data?.access;
//     if (!newAccess) throw new Error("Refresh returned no access");
//     Cookies.set(ACCESS_KEY, newAccess, { expires: 1 / 24 });
//     if (r.data?.refresh) setRefreshToken(r.data.refresh);
//     return newAccess;
//   }
//   const rr = await api.post(`/v1/auth/refresh/`, {}, { withCredentials: true });
//   const newAccess = rr.data?.access;
//   if (!newAccess) throw new Error("Cookie refresh returned no access");
//   Cookies.set(ACCESS_KEY, newAccess, { expires: 1 / 24 });
//   return newAccess;
// }

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config || {};
//     if (error?.response?.status === 401 && !original._retry) {
//       original._retry = true;
//       try {
//         const newAccess = await doTokenRefresh();
//         original.headers = original.headers || {};
//         original.headers["Authorization"] = `Bearer ${newAccess}`;
//         return api(original);
//       } catch (e) {
//         Cookies.remove(ACCESS_KEY);
//         return Promise.reject(e);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// // ─────────────────────────────────────────────────────────────
// // 일반 로그인(이메일/비번)
// export async function loginAndStore({ email, password, AUTH_BASE = "/v1/auth" }) {
//   const r = await api.post(
//     `${AUTH_BASE}/login/`,
//     { email, password },
//     { headers: { "Content-Type": "application/json", Accept: "application/json" } }
//   );

//   const access = r.data?.access;
//   if (!access) throw new Error("Login must return access");

//   Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
//   return r.data;
// }

// export function logoutLocal() {
//   Cookies.remove(ACCESS_KEY);
// }

// export function setAccessToken(access) {
//   if (access) Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
// }

// // ─────────────────────────────────────────────────────────────
// // 회원가입 로직
// export async function registerUser(payload, AUTH_BASE = "/v1/auth") {
//   const r = await api.post(
//     `${AUTH_BASE}/register/`,
//     payload,
//     { header: {"Content-Type": "application/json"}}
//   );
//   return r.data;
// }

import axios from "axios";
import Cookies from "js-cookie";

const REFRESH_KEY = "refreshToken";
export function setRefreshToken(t) { if (t) Cookies.set(REFRESH_KEY, t, { expires: 7 }); }
export function getRefreshToken() { return Cookies.get(REFRESH_KEY); }

const BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";
const ACCESS_KEY = "accessToken";

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

// 요청 인터셉터: access 헤더 부착
api.interceptors.request.use((config) => {
  const access = Cookies.get(ACCESS_KEY);
  if (access) config.headers["Authorization"] = `Bearer ${access}`;
  else delete config.headers?.Authorization;
  return config;
});

async function doTokenRefresh() {
  // 1) httpOnly 쿠키 기반 우선 (서버가 쿠키로만 refresh를 주는 전략 지원)
  try {
    const r = await api.post(`/v1/auth/refresh/`, {}, { withCredentials: true });
    const access = r.data?.access;
    if (r.data?.refresh) setRefreshToken(r.data.refresh);
    if (access) {
      Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
      return access;
    }
  } catch (_) {
    // no-op → 다음 단계로
  }

  // 2) body 저장형 refresh 사용 (프론트 쿠키/스토리지 보관)
  const refresh = getRefreshToken();
  if (refresh) {
    const r = await api.post(`/v1/auth/token/refresh/`, { refresh });
    const access = r.data?.access;
    if (!access) throw new Error("Refresh returned no access");
    Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
    if (r.data?.refresh) setRefreshToken(r.data.refresh); // rotate 대응
    return access;
  }

  throw new Error("No refresh token available");
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
        throw e;
      }
    }
    throw error;
  }
);

export default api;

// 일반 로그인
export async function loginAndStore({ email, password, AUTH_BASE = "/v1/auth" }) {
  const r = await api.post(
    `${AUTH_BASE}/login/`,
    { email, password },
    { headers: { "Content-Type": "application/json", Accept: "application/json" } }
  );
  const access = r.data?.access;
  if (!access) throw new Error("Login must return access");
  Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
  if (r.data?.refresh) setRefreshToken(r.data.refresh); // ★ 추가
  return r.data;
}

export function logoutLocal() {
  Cookies.remove(ACCESS_KEY);
}

export function setAccessToken(access) {
  if (access) Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });
}

// 회원가입
export async function registerUser(payload, AUTH_BASE = "/v1/auth") {
  const r = await api.post(`${AUTH_BASE}/register/`, payload, { header: {"Content-Type": "application/json"}});
  return r.data;
}
