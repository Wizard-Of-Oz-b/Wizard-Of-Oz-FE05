import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { getToken, clearToken } from "../lib/auth";

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState("loading");
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    async function verify() {
      const token = getToken();
      if (!token) {
        if (mounted) setStatus("unauthed");
        return;
      }

      try {
        await api.get("/v1/admins/", { signal: ctrl.signal });
        if (!mounted) return;
        setStatus("ok");
      } catch (e) {
        const code = e?.response?.status;
        clearToken();
        if (mounted) setStatus(code === 401 ? "unauthed" : "forbidden");
      }
    }

    verify();
    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [location.pathname]);

  if (status === "loading") return <div className="p-6">권한 확인 …</div>;
  if (status === "unauthed") return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (status === "forbidden") return <Navigate to="/errors/403" replace />;

  return <Outlet />;
}
