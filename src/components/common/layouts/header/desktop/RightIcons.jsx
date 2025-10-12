import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ShoppingCart,
  Heart,
  ChevronRight,
  LogOut,
  User2,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutLocal } from "../../../../../lib/axios";
import { useAuth } from "../../../../../context/AuthContext";
import { useCartCount } from "../../../../../store/cartCount";

function MenuItem({ icon: Icon, label, onClick, firstRef, danger = false }) {
  const base =
    "w-full px-4 py-3 text-left text-sm flex items-center justify-between rounded-lg focus:outline-none transition";
  const normal =
    "hover:bg-gray-50 focus:bg-gray-50 text-black";
  const dangerCls =
    "text-red-600 hover:bg-red-50 focus:bg-red-50";
  return (
    <button
      ref={firstRef}
      className={`${base} ${danger ? dangerCls : normal}`}
      onClick={onClick}
      role="menuitem"
    >
      <span className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${danger ? "text-red-600" : "text-black"}`} />
        {label}
      </span>
      {!danger && <ChevronRight className="w-4 h-4 text-gray-400" />}
    </button>
  );
}

export default function RightIcons({ isLight, onOpenSearch }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, setUser, isAdmin } = useAuth();
  const base = isLight ? "hover:opacity-80 text-black" : "hover:opacity-80 text-white";
  const cartCount = useCartCount((s) => s.count);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const firstItemRef = useRef(null);

  // 외부 클릭/ESC 닫기
  useEffect(() => {
    function onClickOutside(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenu(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpenMenu(false);
    }
    if (openMenu) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKeyDown);
      setTimeout(() => firstItemRef.current?.focus(), 0);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const displayName = user?.displayName || user?.nickname || user?.name || "사용자";
  const emailText = user?.email || "";
  const initials = (displayName || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleUserClick() {
    if (!isLoggedIn) return navigate("/login");
    setOpenMenu((v) => !v);
  }

  function handleLogout() {
    logoutLocal();
    setUser(null);
    setOpenMenu(false);
    navigate("/login", { replace: true });
  }

  return (
    <motion.div
      className="relative flex items-center gap-4 text-xl"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.06 } }}
    >
      {/* 검색 */}
      <button aria-label="Search" 
              className={`base cursor-pointer`} 
              onClick={onOpenSearch}>
        <Search className="w-7 h-7" />
      </button>

      {/* 위시리스트 */}
      <button
        aria-label="Wishlist"
        className={`base cursor-pointer`}
        onClick={() => navigate("/wishlist")}
      >
        <Heart className="w-7 h-7" />
      </button>

      {/* 유저 */}
      <div className="relative" ref={menuRef}>
        <button
          aria-label="Account"
          className={`${base} relative cursor-pointer`}
          onClick={handleUserClick}
        >
          <User className="w-7 h-7" />
        </button>

        {/* 오버레이 */}
        <AnimatePresence>
          {isLoggedIn && openMenu && (
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />
          )}
        </AnimatePresence>

        {/* 드롭다운 */}
        <AnimatePresence>
          {isLoggedIn && openMenu && (
            <motion.div
              key="user-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 z-50"
            >
              {/* caret */}
              <div className="relative">
                <div className="absolute right-6 -top-2 w-3 h-3 rotate-45 bg-white border border-gray-200"></div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-xl bg-white">
                {/* 헤더 섹션 */}
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-900 text-white grid place-items-center font-semibold">
                      {initials || <User2 className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold leading-5 truncate text-black">
                        {displayName} 님
                      </p>
                      {emailText ? (
                        <p className="text-xs text-gray-500 truncate">{emailText}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* 메뉴 섹션 */}
                <div className="p-2" role="menu" aria-label="user-menu">
                  <MenuItem
                    icon={User2}
                    label="마이페이지"
                    firstRef={firstItemRef}
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/mypage");
                    }}
                  />

                  {/* 구분선 */}
                  <div className="my-2 h-px bg-gray-100" />

                  {/* 관리자  */}
                  {isAdmin && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-1">
                      <MenuItem
                        icon={Shield}
                        label="관리자 센터"
                        onClick={() => {
                          setOpenMenu(false);
                          navigate("/admin");
                        }}
                      />
                    </div>
                  )}

                  {/* 로그아웃 */}
                  <div className="my-2 h-px bg-gray-100" />
                  <MenuItem
                    icon={LogOut}
                    label="로그아웃"
                    onClick={handleLogout}
                    danger
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 장바구니 */}
      <button
        aria-label="Cart"
        className={`${base} relative`}
        onClick={() => navigate("/cart")}
      >
        <ShoppingCart className="w-7 h-7 cursor-pointer hover:scale-110 hover:opacity-80 transition" />
        {cartCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold grid place-items-center shadow"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>
    </motion.div>
  );
}
