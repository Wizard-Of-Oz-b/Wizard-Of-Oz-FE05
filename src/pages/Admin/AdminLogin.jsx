import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, ChevronRight, ShieldCheck, Eye, EyeOff, UserCog } from "lucide-react";
import api from "../../lib/axios";
import { setToken, clearToken, getToken } from "../../lib/auth";

const BACKEND_READY = import.meta.env.VITE_BACKEND_READY === "true";
const AUTH_API = import.meta.env.VITE_AUTH_API_BASE ?? "/api/v1/auth";
const ADMIN_API = import.meta.env.VITE_ADMIN_API_BASE ?? "/api/v1/admin";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(json.split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
  } catch {
    return null;
  }
}

const roleMap = {
  super: "admin",
  superadmin: "admin",
  admin: "admin",
  manager: "manager",
  cs: "manager",
  user: "user",
  customer: "user",
};

async function detectAdminRole() {
  const token = getToken();
  const claim = token ? parseJwt(token) : null;
  const claimRole = claim?.role || claim?.roles?.[0] || claim?.permissions?.role;
  const mapped = claimRole ? roleMap[String(claimRole).toLowerCase()] : undefined;

  try {
    const r = await api.get(`${ADMIN_API}/users/`);
    if (r.status === 200) {
      return mapped || "manager";
    }
  } catch (e) {
    if (e?.response?.status === 401 || e?.response?.status === 403) throw e;
  }
  return null;
}

async function exchangeWithRefresh(storedRefresh) {
  if (storedRefresh) {
    try {
      const r = await api.post(
        `${AUTH_API}/token/refresh/`,
        { refresh: storedRefresh },
        { headers: { Authorization: undefined, Accept: "application/json" } }
      );
      return r?.data?.access ? r.data : null;
    } catch {}
  }
  try {
    const r = await api.post(
      `${AUTH_API}/token/refresh/`,
      {},
      { headers: { Authorization: undefined, Accept: "application/json" }, withCredentials: true }
    );
    return r?.data?.access ? r.data : null;
  } catch {
    return null;
  }
}

async function tryAuth(email, password) {
  const attempts = [
    { url: `${AUTH_API}/login`,   body: { email, password }, withCreds: false },
    { url: `${AUTH_API}/login/`,  body: { email, password }, withCreds: false },
    { url: `${AUTH_API}/token/`,  body: { username: email, password }, withCreds: false },
    { url: `${AUTH_API}/token/`,  body: { email, password }, withCreds: false },
  ];

  for (const a of attempts) {
    try {
      const r = await api.post(a.url, a.body, {
        headers: { Authorization: undefined, Accept: "application/json" },
        withCredentials: a.withCreds,
      });
      if (r?.data?.access) return r.data;
      const byRefresh = await exchangeWithRefresh(r?.data?.refresh);
      if (byRefresh?.access) return { ...byRefresh, refresh: r?.data?.refresh ?? byRefresh?.refresh };
    } catch (e) {
      const s = e?.response?.status;
      if (s && s !== 400 && s !== 401) throw e;
    }
  }

  const fromStore = localStorage.getItem("refresh_token");
  const byRefresh2 = await exchangeWithRefresh(fromStore);
  if (byRefresh2?.access) return byRefresh2;

  const err = new Error("로그인은 응답했지만 access 토큰을 확보하지 못했습니다.");
  err.status = 500;
  throw err;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mockRole, setMockRole] = useState("super");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    // 서버 OFF: 모의 로그인
    if (!BACKEND_READY) {
      localStorage.setItem("admin_role", mockRole);
      navigate("/admin", { replace: true });
      return;
    }

try {
  setLoading(true);

  const data = await tryAuth(email, password);
  setToken(data.access);
  if (data.refresh) localStorage.setItem("refresh_token", data.refresh);

  const role = await detectAdminRole();
  if (!role) {
    clearToken();
    navigate("/errors/403", { replace: true });
    return;
  }

  localStorage.setItem("admin_role", role);
  navigate(from || "/admin", { replace: true });
} catch (err) {
      const code = err?.response?.status || err?.status;
      if (code === 403) {
        clearToken();
        navigate("/errors/403", { replace: true });
      } else if (code === 401) {
        clearToken();
        navigate("/admin/login", { replace: true });
      } else if (code === 404) {
        navigate("/errors/404", { replace: true });
      } else {
        navigate("/errors/500", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-30" style={{ background: "radial-gradient(800px 600px at 20% -10%, rgba(139,92,246,.35), rgba(0,0,0,0) 60%), radial-gradient(700px 500px at 85% 10%, rgba(217,70,239,.28), rgba(0,0,0,0) 60%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(1200px 1000px at 50% -10%, rgba(255,255,255,.05), rgba(0,0,0,0) 60%)" }} />
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="w-full max-w-md">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-1 shadow-[0_0_120px_-40px_rgba(139,92,246,.6)] backdrop-blur">
            <div className="rounded-2xl bg-neutral-900 p-6 md:p-8">
              {/* 헤더 */}
              <div className="mb-6 flex items-start gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/30">
                  <Lock className="size-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                    <span className="bg-gradient-to-r from-violet-300 via-white to-fuchsia-300 bg-clip-text text-transparent">관리자 로그인</span>
                  </h1>
                  <p className="mt-1 text-sm text-white/60">관리자 전용 영역입니다.<br /> 권한이 없을 경우 접근이 제한됩니다</p>
                </div>
                {/* 서버 상태 배지 */}
                <div className="ml-auto">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${BACKEND_READY ? "bg-emerald-500/20 text-emerald-200 ring-emerald-400/40" : "bg-red-500/20 text-red-200 ring-red-400/40"}`}>
                    <ShieldCheck className="size-3.5" />
                    {BACKEND_READY ? "SERVER: ON" : "SERVER: OFF"}
                  </span>
                </div>
              </div>
              {/* 서버 OFF -> 목업 로그인 */}
              {!BACKEND_READY && (
                <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm text-white/80">테스트용 역할 선택</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/20 px-2 py-0.5 text-[11px] font-semibold text-violet-200 ring-1 ring-violet-400/30">MOCK</span>
                  </div>
                  <div className="relative">
                    <UserCog className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                    <select className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none ring-violet-500/40 focus:ring-2" value={mockRole} onChange={(e) => setMockRole(e.target.value)}>
                      <option value="super">super (슈퍼관리자)</option>
                      <option value="manager">manager (페이지 관리자)</option>
                      <option value="cs">cs (CS 관리자)</option>
                      <option value="user">user (일반 회원)</option>
                    </select>
                  </div>
                  <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500" onClick={() => { localStorage.setItem("admin_role", mockRole); navigate("/admin", { replace: true }); }}>
                    테스트 로그인
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
              {/* 서버 ON -> 실제 로그인 */}
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input type="email" autoComplete="username" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none placeholder:text-white/40 ring-violet-500/40 focus:ring-2 disabled:opacity-40" placeholder="관리자 이메일(또는 사용자명)" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!BACKEND_READY || loading} />
                </div>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
                  <input type={showPw ? "text" : "password"} autoComplete="current-password" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-10 text-sm outline-none placeholder:text-white/40 ring-violet-500/40 focus:ring-2 disabled:opacity-40" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!BACKEND_READY || loading} />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/50 hover:bg-white/10" tabIndex={-1}>
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <motion.button whileTap={{ scale: BACKEND_READY ? 0.98 : 1 }} className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40" disabled={!BACKEND_READY || loading}>
                  {loading ? "로그인 중…" : "로그인"}
                  <ChevronRight className="size-4" />
                </motion.button>
              </form>
              <div className="mt-6 text-center text-xs text-white/50">© {new Date().getFullYear()} 오즈의 이상한 상점 · All rights reserved.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
