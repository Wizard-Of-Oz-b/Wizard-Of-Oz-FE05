// src/routes/AdminProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminProtectedRoute({ allowRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null); // { role: "super" | "manager" | "cs" | "user" }
  const location = useLocation();

  useEffect(() => {
    // 데모로그인
    const mockRole = localStorage.getItem("mock_admin_role");
    if (mockRole) setMe({ role: mockRole });
    setLoading(false);
  }, []);

  if (loading) return <div className="p-6">권한 확인 중...</div>;

  // 로그인/권한 정보 없음 → 로그인 페이지로
  if (!me) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const role = String(me.role || "").toLowerCase();
  const ok =
    allowRoles.length === 0 ||
    allowRoles.map((r) => r.toLowerCase()).includes(role);

  if (!ok) return <Navigate to="/403" replace />;

  return <Outlet />;
}
