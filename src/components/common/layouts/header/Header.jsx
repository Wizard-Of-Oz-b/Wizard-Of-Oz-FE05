import React, { useEffect, useRef, useState } from "react";
import { PRIMARY, SEARCH, SUGGEST } from "./constants";
import { spring } from "./animations";
import TopBar from "./desktop/TopBar";
import PrimaryNav from "./desktop/PrimaryNav";
import RightIcons from "./desktop/RightIcons";
import DesktopDropdown from "./desktop/DesktopDropdown";
import MobileMenu from "./mobile/MobileMenu";

export default function Header({ className = "", onSelectSub, onSearch }) {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const closeTimer = useRef(null);
  const inputRef = useRef(null);
  const isLight = !!active || mobileOpen;

  const open = (p) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(p);
  };

  const delayedClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 120);
  };

  const submitSearch = (e) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;
    onSearch?.(keyword.trim(), active && active !== SEARCH ? active : null);
    setKeyword("");
    setActive(null);
  };

  // 검색 일 때 포커스주기
  useEffect(() => {
    if (active === SEARCH && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [active]);

  return (
    <header className={"absolute inset-x-0 top-0 z-40 select-none " + className} onMouseLeave={delayedClose}>
      {/* 상단 바 */}
      <div
        className={[
          "flex items-center justify-between px-6 py-4 transition-colors duration-200",
          isLight ? "bg-white/95 text-black shadow-sm backdrop-blur" : "bg-transparent text-white",
          isLight ? "border-b border-black/10" : "",
        ].join(" ")}
      >
        <TopBar isLight={isLight} onOpenMobile={() => setMobileOpen(true)} />
        <PrimaryNav isLight={isLight} active={active} open={open} />
        <RightIcons
          isLight={isLight}
          onOpenSearch={() => {
            setMobileOpen(false);
            open(SEARCH);
          }}
        />
      </div>

      {/* 데스크탑 드롭다운 */}
      <DesktopDropdown
        active={active}
        keyword={keyword}
        setKeyword={setKeyword}
        inputRef={inputRef}
        onSubmitSearch={submitSearch}
        onSelectSub={(p, item) => onSelectSub?.(p, item)}
        open={open}
        delayedClose={delayedClose}
      />

      {/* 모바일 메뉴 */}
      <MobileMenu
        open={mobileOpen}
        keyword={keyword}
        setKeyword={setKeyword}
        onClose={() => setMobileOpen(false)}
        onSubmitSearch={submitSearch}
        onSelectSub={(p, item) => onSelectSub?.(p, item)}
      />
    </header>
  );
}

