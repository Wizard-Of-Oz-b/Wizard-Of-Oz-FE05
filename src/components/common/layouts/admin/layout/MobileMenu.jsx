import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Home, LayoutDashboard, LogOut } from 'lucide-react';
import { NAV_SECTIONS, linkClass } from './navConfig';
import React from 'react';

const collapseVariants = {
  collapsed: { height: 0, opacity: 0 },
  open:      { height: 'auto', opacity: 1 },
};

export default function MobileMenu({
  menuOpen,
  setMenuOpen,
  menuRef,
  openSections,
  toggleSection,
}) {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-admintheme-black/90 border-b border-admintheme-violet-dark backdrop-blur">
      <div className="mx-auto max-w-[110rem] px-4 h-14 flex items-center justify-between text-admintheme-white">
        <div className="text-lg font-bold">오즈의 이상한 상점</div>

        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center gap-1 rounded-lg border border-admintheme-violet bg-admintheme-black px-3 py-1.5 text-sm hover:bg-admintheme-violet-dark"
            onClick={() => setMenuOpen((v) => !v)}
          >
            메뉴
            <ChevronDown className={`h-4 w-4 transition ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-xl border border-admintheme-violet-light bg-admintheme-black shadow-xl p-2"
              >
                {/* 대시보드 */}
                <div className="mb-2">
                  <NavLink
                    to="/admin"
                    end
                    className={linkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>대시보드</span>
                  </NavLink>
                </div>

                {/* 섹션 */}
                <ul className="space-y-2">
                  {NAV_SECTIONS.map((sec) => (
                    <li key={sec.id} className="border border-admintheme-violet-dark/50 rounded-lg">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-admintheme-white hover:bg-admintheme-violet-dark rounded-lg"
                        onClick={() => toggleSection(sec.id)}
                      >
                        <span className="font-semibold">{sec.title}</span>
                        <ChevronDown className={`h-4 w-4 transition ${openSections[sec.id] ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {openSections[sec.id] && (
                          <motion.ul
                            key={`${sec.id}-m`}
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={collapseVariants}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden px-2 pb-2 space-y-1"
                          >
                            {sec.items.map((n) => (
                              <li key={n.to}>
                                <NavLink
                                  to={n.to}
                                  end={n.end}
                                  className={linkClass}
                                  onClick={() => setMenuOpen(false)}
                                >
                                  {n.icon && React.createElement(n.icon, { className: 'h-4 w-4' })}
                                  <span>{n.label}</span>
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>

                {/* 기타메뉴 */}
                <div className="mt-3 border-t border-admintheme-violet-light pt-2">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
                      ${
                        isActive
                          ? 'bg-admintheme-violet text-admintheme-white font-semibold shadow-md'
                          : 'text-admintheme-white hover:bg-admintheme-violet-dark hover:text-admintheme-white'
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    홈페이지로 이동
                  </NavLink>
                </div>

                <div className="mt-4 border-t border-admintheme-violet-light pt-2 text-xs text-admintheme-violet-light">
                  관리자 메뉴
                  <button
                    className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-admintheme-violet-dark"
                    onClick={() => {
                      localStorage.removeItem('mock_admin_role');
                      window.location.href = '/admin/login';
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
