import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileMenu from './layout/MobileMenu';
import Sidebar from './layout/Sidebar';
import { loadOpen, saveOpen, NAV_SECTIONS } from './layout/navConfig';

export default function AdminLayout() {
  // 모바일 메뉴 상태
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [openSections, setOpenSections] = useState(() => {
    const saved = loadOpen();
    const init = {};
    NAV_SECTIONS.forEach((s) => (init[s.id] = saved[s.id] ?? true));
    return init;
  });
  const toggleSection = (id) =>
    setOpenSections((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveOpen(next);
      return next;
    });

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onEsc = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  return (
    <div className="admin-layout h-screen bg-admintheme-black flex flex-col overflow-y-auto">
      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuRef={menuRef}
        openSections={openSections}
        toggleSection={toggleSection}
      />

      <div className="mx-auto max-w-[110rem] w-full flex-1 flex gap-4 py-6 px-4">
        <Sidebar openSections={openSections} onToggleSection={toggleSection} />

        {/* 메인 */}
        <main className="min-h-[60vh] flex-2 rounded-2xl bg-admintheme-white shadow w-full">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
