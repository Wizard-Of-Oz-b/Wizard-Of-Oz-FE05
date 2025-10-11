/**
 * 관리자페이지 인증/권한 처리 원칙
 * - 401 Unauthorized: 토큰이 만료/무효일 수 있습니다.
 *   브라우저에 남은 토큰 때문에 재접속 시 401이 반복될 수 있으므로
 *   clearToken()으로 토큰을 정리하고 로그인 화면으로 안내합니다.
 *
 * - 403 Forbidden: 토큰은 유효하지만 권한이 부족한 상태입니다.
 *   세션은 유지해야 하므로 토큰은 그대로 두고 접근 제한 페이지로 안내합니다.
 *
 * 이 페이지는 위 원칙을 기준으로 작성되었습니다.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from '../lib/axios';
import Cookies from 'js-cookie';
import { clearToken } from '../lib/auth';
import LoadingOverlay from '../components/common/layouts/admin/LoadingOverlay';

const ADMIN_API_BASE_RAW = import.meta?.env?.VITE_ADMIN_API_BASE ?? '/v1/admin';
const ACCESS_KEY = 'accessToken';

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
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const roleMap = {
  super: 'admin',
  superadmin: 'admin',
  admin: 'admin',
  manager: 'manager',
  cs: 'cs',
  user: 'user',
  customer: 'user',
};

export default function AdminProtectedRoute({ allowRoles = ['admin', 'manager', 'cs'] }) {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  const allowed = useMemo(() => allowRoles.map((r) => roleMap[r] ?? r), [allowRoles]);

  useEffect(() => {
    let mounted = true;
    const ctrl = new AbortController();

    async function verify() {
      const token = Cookies.get(ACCESS_KEY);
      if (!token) {
        if (mounted) setStatus('unauthed');
        return;
      }

      const payload = parseJwt(token);
      const claimRole = payload?.role || payload?.roles?.[0] || payload?.permissions?.role;
      const serverRole = roleMap[String(claimRole || '').toLowerCase()];
      if (serverRole && allowed.includes(serverRole)) {
        if (mounted) setStatus('ok');
        return;
      }

      try {
        await api.get(joinAdminPath('/users/'), { signal: ctrl.signal });
        if (!mounted) return;
        setStatus('ok');
      } catch (e) {
        const code = e?.response?.status;
        if (!mounted) return;
        if (code === 401) {
          clearToken();
          setStatus('unauthed');
        } else if (code === 403) {
          setStatus('forbidden');
        } else {
          setStatus('forbidden');
        }
      }
    }

    verify();
    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [location.pathname, allowed.join('|')]);

  if (status === 'loading')   return <LoadingOverlay message="권한 확인 중…" subtext="잠시만 기다려주세요" />;
  if (status === 'unauthed')  return <Navigate to="/admin/login" replace state={{ from: location }} />;
  if (status === 'forbidden') return <Navigate to="/errors/403" replace />;
  return <Outlet />;
}
