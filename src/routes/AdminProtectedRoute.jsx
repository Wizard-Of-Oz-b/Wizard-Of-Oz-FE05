import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../lib/axios';
import { getToken, clearToken } from '../lib/auth';

const ADMIN_API_BASE_RAW = import.meta?.env?.VITE_ADMIN_API_BASE ?? '/v1/admin';

const joinAdminPath = (suffix = '') => {
  const baseURL = (api.defaults.baseURL || '').replace(/\/+$/, '');
  let base = (ADMIN_API_BASE_RAW || '').replace(/\/+$/, '');
  let path = `${base}${suffix}`;

  if (baseURL.endsWith('/api') && path.startsWith('/api/')) {
    path = path.replace(/^\/api\//, '/');
  }
  return path;
};

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// UI ↔ 서버 역할 매핑
const roleMap = {
  super: 'admin',
  superadmin: 'admin',
  admin: 'admin',
  manager: 'manager',
  cs: 'manager',
  user: 'user',
  customer: 'user',
};

export default function AdminProtectedRoute({ allowRoles = ['admin', 'manager'] }) {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  const allowed = useMemo(
    () => allowRoles.map((r) => roleMap[r] ?? r),
    [allowRoles]
  );

  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    async function verify() {
      const token = getToken();
      if (!token) {
        if (mounted) setStatus('unauthed');
        return;
      }

      // 1) 토큰의 role로 우선 판별
      const payload = parseJwt(token);
      const claimRole = payload?.role || payload?.roles?.[0] || payload?.permissions?.role;
      const serverRole = roleMap[String(claimRole || '').toLowerCase()];
      if (serverRole && allowed.includes(serverRole)) {
        if (mounted) setStatus('ok');
        return;
      }

      // 2) 관리자 API 접근 가능 여부로 확인
      try {
        await api.get(joinAdminPath('/users/'), { signal: ctrl.signal });
        if (!mounted) return;
        setStatus('ok');
      } catch (e) {
        const code = e?.response?.status;
        if (code === 401) {
          clearToken();
          if (mounted) setStatus('unauthed');
        } else if (code === 403) {
          if (mounted) setStatus('forbidden');
        } else {
          if (mounted) setStatus('forbidden');
        }
      }
    }

    verify();
    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [location.pathname, allowed.join('|')]);

  if (status === 'loading') return <div className="p-6 text-sm text-gray-600">권한 확인 중…</div>;
  if (status === 'unauthed') return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (status === 'forbidden') return <Navigate to="/errors/403" replace />;
  return <Outlet />;
}
