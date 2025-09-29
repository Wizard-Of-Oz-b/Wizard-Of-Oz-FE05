
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import api, { logoutLocal } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { provider } = useParams();
  const [sp] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const code = sp.get("code");
        const state = sp.get("state");
        if (!code) throw new Error("Missing authorization code");

        const SITE = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/,"");
        const CB = import.meta.env.VITE_OAUTH_CALLBACK_PATH || "/auth/callback";
        const redirect_uri = `${SITE}${CB}/${provider}`;

        // 1) 백엔드에 코드 교환
        const r = await api.post(`/v1/auth/social/${provider}/login/`, {
          code, state, redirect_uri
        }, { headers: { "Content-Type": "application/json", Accept: "application/json" }});

        const access = r.data?.access;
        const refresh = r.data?.refresh;
        if (!access || !refresh) throw new Error("No tokens returned");

        // 2) 토큰 저장
        Cookies.set(ACCESS_KEY, access, { expires: 1/24 });
        Cookies.set(REFRESH_KEY, refresh, { expires: 7 });

        // 3) 내 정보 로드
        const { data: me } = await api.get("/v1/users/me/");
        const displayName = (() => {
          const bad = v => !v || v === "string";
          const cand = [me.nickname, me.name, me.username, (me.email && me.email.split("@")[0])];
          return (cand.find(v => !bad(v))) || "사용자";
        })();
        setUser({ ...me, displayName });

        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        logoutLocal?.();
        navigate("/login", { replace: true, state: { socialError: e?.message || "소셜 로그인에 실패했습니다." }});
      }
    })();
  }, []); 

  return null; 
}