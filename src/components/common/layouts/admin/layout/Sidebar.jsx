import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, LogOut } from 'lucide-react';
import SidebarSection from './SidebarSection';
import { NAV_SECTIONS, linkClass } from './navConfig';

export default function Sidebar({ openSections, onToggleSection }) {
  return (
    <aside className="hidden md:block w-72 shrink-0">
      <div className="sticky top-6 rounded-2xl border border-admintheme-violet-dark bg-admintheme-black shadow-lg">
        <div className="p-5">
          <h2 className="text-xl font-extrabold mb-4 text-admintheme-white tracking-wide">
            관리자 페이지
          </h2>

          {/* 대시보드 */}
          <div className="mb-3">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span>대시보드</span>
            </NavLink>
          </div>

          {/* 섹션 */}
          <div className="space-y-3">
            {NAV_SECTIONS.map((sec) => (
              <SidebarSection
                key={sec.id}
                id={sec.id}
                title={sec.title}
                open={openSections[sec.id]}
                onToggle={onToggleSection}
              >
                <ul className="space-y-1">
                  {sec.items.map((n) => (
                    <li key={n.to}>
                      <NavLink to={n.to} end={n.end} className={linkClass}>
                        {n.icon}
                        <span>{n.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </SidebarSection>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-full inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
               ${
                 isActive
                   ? 'bg-admintheme-violet text-admintheme-white font-semibold shadow-md'
                   : 'text-admintheme-white border border-admintheme-violet hover:bg-admintheme-violet-dark'
               }`
            }
          >
            <Home className="h-4 w-4" />
            홈페이지로 이동
          </NavLink>

          <button
            onClick={() => {
              localStorage.removeItem('mock_admin_role');
              window.location.href = '/admin/login';
            }}
            className="mt-2 w-full inline-flex items-center gap-2 rounded-lg border border-admintheme-violet px-3 py-2 text-sm text-admintheme-white hover:bg-admintheme-violet-dark transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>

          <p className="mt-4 text-xs text-admintheme-violet-light">
            © {new Date().getFullYear()} 오즈의 이상한 상점
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
}
