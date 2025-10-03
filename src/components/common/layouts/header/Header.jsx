import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIMARY, SEARCH, SUGGEST } from "./constants";
import { spring } from "./animations";
import TopBar from "./desktop/TopBar";
import PrimaryNav from "./desktop/PrimaryNav";
import RightIcons from "./desktop/RightIcons";
import DesktopDropdown from "./desktop/DesktopDropdown";
import MobileMenu from "./mobile/MobileMenu";
import { getCategoryId } from "./categoryIdMap";

export default function Header({ className = "", onSelectSub, onSearch }) {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const closeTimer = useRef(null);
  const inputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomepage = location.pathname === "/";
  const isLight = !!active || mobileOpen || !isHomepage;

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
    const q = keyword.trim();
    const primary = active && active !== SEARCH ? active : null;
    onSearch?.(q, primary);
    const qs = new URLSearchParams({ q, page: "1", sort: "created_at" });
    if (primary) qs.set("primary", String(primary));
    navigate({ pathname: "/results/list", search: `?${qs.toString()}` });
    setKeyword("");
    setActive(null);
  };

  const handleSelectSub = (p, item) => {
    const qRaw = (item || "").trim();
    if (!qRaw) return; 
    
    onSelectSub?.(p, item);

    let cid = getCategoryId(p, qRaw);

    const qs = new URLSearchParams({ page: "1", sort: "created_at" });
    if (p) qs.set("primary", String(p).toUpperCase());
    qs.set("item", qRaw);
    if (cid) qs.set("category_id", cid);

    navigate({ pathname: "/products/list", search: `?${qs.toString()}` }, { replace: true });
    setActive(null);
    };

  useEffect(() => {
    if (active === SEARCH && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [active]);

  return (
    <header className={"fixed inset-x-0 top-0 z-40 select-none " + className} onMouseLeave={delayedClose}>
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
        onSelectSub={handleSelectSub}
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
        onSelectSub={handleSelectSub}
      />
    </header>
  );
}