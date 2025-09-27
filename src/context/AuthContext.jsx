import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../lib/axios";

const AuthContext = createContext(undefined);

function deriveDisplayName(me = {}) {
  const isBad = (v) => !v || v === "string";
  const tryOrder = [me.nickname, me.name, me.username, (me.email && me.email.split("@")[0]) || null];
  const picked = tryOrder.find((v) => !isBad(v));
  return picked || "사용자";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const access = Cookies.get("accessToken");
    if (!access) {
      setBootstrapping(false);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get("/v1/users/me/");
        const displayName = deriveDisplayName(data);
        setUser({ ...data, displayName });
      } catch (_) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const isLoggedIn = !!user;
  const role = String(user?.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "superadmin"; // 필요 시 확장

  const value = useMemo(
    () => ({ user, isLoggedIn, isAdmin, role, setUser, bootstrapping }),
    [user, isLoggedIn, isAdmin, role, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth는 <AuthProvider> 내부에서만 사용해야 합니다.");
  return ctx;
};
