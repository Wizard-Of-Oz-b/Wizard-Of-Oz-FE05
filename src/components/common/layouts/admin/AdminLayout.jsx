import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Package,
  Users, Tag, Percent, Bell, ChevronDown, LogOut, Home
} from "lucide-react";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const nav = [
    { to: "/admin", end: true, label: "대시보드", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/admin/products", label: "상품 관리", icon: <ShoppingBag className="h-4 w-4" /> },
    { to: "/admin/orders", label: "주문 관리", icon: <Package className="h-4 w-4" /> },
    { to: "/admin/customers", label: "회원 관리", icon: <Users className="h-4 w-4" /> },
    { to: "/admin/categories", label: "카테고리 관리", icon: <Tag className="h-4 w-4" /> },
    { to: "/admin/coupons", label: "쿠폰/프로모션", icon: <Percent className="h-4 w-4" /> },
    { to: "/admin/notifications", label: "공지/알림", icon: <Bell className="h-4 w-4" /> },
    { to: "/", label: "홈페이지로 이동", icon: <Home className="h-4 w-4" /> },
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
     ${isActive
       ? "bg-admintheme-violet text-admintheme-white font-semibold shadow-md"
       : "text-admintheme-white hover:bg-admintheme-violet-dark hover:text-admintheme-white"}`;

  return (
    <div className="min-h-screen bg-admintheme-black flex flex-col">
      {/* 모바일 상단바 */}
      <header className="md:hidden sticky top-0 z-40 bg-admintheme-black/90 border-b border-admintheme-violet-dark backdrop-blur">
        <div className="mx-auto max-w-[110rem] px-4 h-14 flex items-center justify-between text-admintheme-white">
          <div className="text-sm font-bold">관리자 메뉴</div>

          {/* 드롭다운 */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-1 rounded-lg border border-admintheme-violet bg-admintheme-black px-3 py-1.5 text-sm hover:bg-admintheme-violet-dark"
              onClick={() => setMenuOpen((v) => !v)}
            >
              메뉴
              <ChevronDown className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-xl border border-admintheme-violet-light bg-admintheme-black shadow-xl p-2"
              >
                <ul className="space-y-1">
                  {nav.map((n) => (
                    <li key={n.to}>
                      <NavLink
                        to={n.to}
                        end={n.end}
                        className={linkClass}
                        onClick={() => setMenuOpen(false)}
                      >
                        {n.icon}
                        <span>{n.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-admintheme-violet-light pt-2 text-xs text-admintheme-violet-light">
                  관리자 메뉴
                  <button
                    className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-admintheme-violet-dark"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] w-full flex-1 flex gap-4 py-6 px-4">
        {/* 사이드바 */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-6 rounded-2xl border border-admintheme-violet-dark bg-admintheme-black shadow-lg">
            <div className="p-5">
              <h2 className="text-xl font-extrabold mb-4 text-admintheme-white tracking-wide">
                관리자 페이지
              </h2>
              <ul className="space-y-1">
                {nav.map((n) => (
                  <li key={n.to}>
                    <NavLink to={n.to} end={n.end} className={linkClass}>
                      {n.icon}
                      <span>{n.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-5 pb-5 text-xs text-admintheme-violet-light">
              © {new Date().getFullYear()} 오즈의 이상한 상점<br />All rights reserved.
            </div>
          </div>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="min-h-[60vh] flex-2 rounded-2xl bg-admintheme-white shadow w-full">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
