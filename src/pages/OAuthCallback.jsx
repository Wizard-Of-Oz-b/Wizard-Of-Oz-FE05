import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import api, { logoutLocal } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const ACCESS_KEY = "accessToken";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { provider: providerFromPath } = useParams();
  const [sp] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const code = sp.get("code");
        const state = sp.get("state");
        const error = sp.get("error");
        const provider = providerFromPath || sessionStorage.getItem("oauth_provider");

        if (!code) throw new Error(error || "Missing authorization code");
        if (!provider) throw new Error("Missing provider");

        // ── 교환 2-트라이: redirect_uri 포함 → 실패 시 미포함 재시도 ──
        const API = (api.defaults.baseURL || "").replace(/\/+$/, ""); // 예: http://localhost/api
        const redirectUriBackend = `${API}/v1/auth/social/${provider}/callback/`;

        const tryExchange = async (payload, label) => {
          try {
            const res = await api.post(
              `/v1/auth/social/${provider}/login/`,
              payload,
              { headers: { "Content-Type": "application/json", Accept: "application/json" } }
            );
            return res;
          } catch (e) {
            console.error(`[${label}] exchange failed`, e?.response?.status, e?.response?.data);
            throw e;
          }
        };

        let r;
        try {
          r = await tryExchange({ code, state, redirect_uri: redirectUriBackend }, "with redirect_uri");
        } catch {
          r = await tryExchange({ code, state }, "without redirect_uri");
        }

        // ── 응답 검사 ──
        const access = r?.data?.access;
        // refresh는 httpOnly 쿠키일 수 있음 → access만 있어도 성공 처리
        if (!access) {
          const msg = r?.data?.detail || r?.data?.message || JSON.stringify(r?.data);
          throw new Error(msg || "No access token");
        }

        // ── 토큰 저장 ──
        Cookies.set(ACCESS_KEY, access, { expires: 1 / 24 });

        // ── 프로필 로드 ──
        const { data: me } = await api.get("/v1/users/me/");
        const ok = (v) => v && v !== "string";
        const displayName =
          [me.nickname, me.name, me.username, me.email && me.email.split("@")[0]].find(ok) || "사용자";
        setUser({ ...me, displayName });

        navigate("/", { replace: true });
      } catch (e) {
        console.error("OAuthCallback error:", e?.message, e);
        logoutLocal?.();
        navigate("/login", {
          replace: true,
          state: { socialError: e?.message || "소셜 로그인에 실패했습니다." },
        });
      }
    })();
  }, []); // eslint-disable-line

  return null;
}