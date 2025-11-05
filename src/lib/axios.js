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
// 1) 에러 한글화
const ERROR_MAP = {
  invalid_credentials: "아이디 또는 비밀번호가 올바르지 않습니다.",
  user_not_found: "가입되지 않은 계정입니다.",
  email_already_used: "이미 사용 중인 이메일입니다.",
};

function extractErrorCode(err) {
  const data = err?.response?.data;
  return (
    data?.code ||
    data?.error_code ||
    data?.error ||
    (typeof data?.detail === "string" && data.detail.toLowerCase().replaceAll(" ", "_")) ||
    null
  );
}

function toUserMessage(err) {
  const status = err?.response?.status;
  const code = extractErrorCode(err);
  if (code && ERROR_MAP[code]) return ERROR_MAP[code];

if (status === 400) {
  const raw = err?.response?.data?.detail || err?.response?.data?.message;
  if (typeof raw === "string") {
    const lower = raw.toLowerCase();

    if (
      lower.includes("invalid") ||
      lower.includes("credential") ||
      lower.includes("no active account") ||
      lower.includes("not found")
    ) {
      return "아이디 또는 비밀번호가 올바르지 않습니다.";
    }
  }
  return "아이디/비밀번호 올바르지 않거나, 계정 상태를 확인해주세요.";
}
  if (status === 401) return "로그인이 필요합니다.";
  if (status === 403) return "접근 권한이 없습니다.";
  if (status === 404) return "요청하신 대상을 찾을 수 없습니다.";
  if (status >= 500) return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  if (err?.code === "ECONNABORTED") return "요청 시간이 초과되었습니다. 네트워크를 확인해주세요.";
  if (!err?.response) return "네트워크 오류가 발생했습니다. 연결 상태를 확인해주세요.";
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

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
        error = e;
      }
    }

    error.userMessage = toUserMessage(error);
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

// ─────────────────────────────────────────────────────────────
// 회원가입 로직
export async function registerUser(payload, AUTH_BASE = "/v1/auth") {
  const r = await api.post(
    `${AUTH_BASE}/register/`,
    payload,
    { headers: {"Content-Type": "application/json"}}
  );
  return r.data;
}