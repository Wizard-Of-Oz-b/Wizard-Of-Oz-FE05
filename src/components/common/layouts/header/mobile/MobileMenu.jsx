import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Sparkles, Heart, ShoppingCart, User, LogIn, UserPlus, Shield, LogOut } from "lucide-react";
import { spring, staggerCols, colItem } from "../animations";
import { PRIMARY, SUGGEST, SUBS } from "../constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../context/AuthContext";

const noop = () => {};

const META = {
  MEN:   { emoji: "👔", bar: "from-sky-500 to-blue-500" },
  WOMEN: { emoji: "👗", bar: "from-fuchsia-500 to-rose-500" },
  KIDS:  { emoji: "🧸", bar: "from-amber-500 to-orange-500" },
  EVENT: { emoji: "🎉", bar: "from-emerald-500 to-teal-500" },
};

export default function MobileMenu({
  open,
  keyword,
  setKeyword = noop,
  onClose = noop,
  onSubmitSearch = noop,
  onSelectSub = noop,
}) {
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [openPrimary, setOpenPrimary] = useState(null);
  const scrollLockRef = useRef({ applied: false, top: 0, prev: {} });

  const handleLogout = async () => {
    try {
      await logout?.();
    } finally {
      onClose();
      navigate("/");
    }
  };

  useEffect(() => {
    const body = document.body;
    if (open && !scrollLockRef.current.applied) {
      const top = window.scrollY || window.pageYOffset || 0; // 현재 스크롤을 저장함

      // 이전의 스타일을 기억함
      scrollLockRef.current.prev = {
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        overflow: body.style.overflow,
      };
      scrollLockRef.current.top = top;

      body.style.position = "fixed";
      body.style.top = `-${top}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";

      scrollLockRef.current.applied = true;
    }

    if (!open && scrollLockRef.current.applied) {
      const { prev, top } = scrollLockRef.current;

      // 스타일 원상 복구
      body.style.position = prev.position || "";
      body.style.top = prev.top || "";
      body.style.width = prev.width || "";
      body.style.overflow = prev.overflow || "";
      // 스크롤 위치 원상 복구
      window.scrollTo(0, top || 0);

      scrollLockRef.current.applied = false;
    }

    return () => {
      if (scrollLockRef.current.applied) {
        const { prev, top } = scrollLockRef.current;
        body.style.position = prev.position || "";
        body.style.top = prev.top || "";
        body.style.width = prev.width || "";
        body.style.overflow = prev.overflow || "";
        window.scrollTo(0, top || 0);
        scrollLockRef.current.applied = false;
      }
    };
  }, [open]);

  const SUGGEST_ALL = Array.isArray(SUGGEST?.ALL) ? SUGGEST.ALL : [];
  const PRIMARY_SAFE = Array.isArray(PRIMARY) ? PRIMARY : [];
  const SUBS_SAFE = SUBS ?? {};

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-backdrop"
            className="md:hidden fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            onClick={onClose}
          />
          <motion.div
            key="mobile-panel"
            className="md:hidden fixed inset-y-0 right-0 z-[60] w-[88%] max-w-[420px] bg-white text-black shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0, transition: spring }}
            exit={{ x: "100%", transition: { duration: 0.15 } }}
          >
          <div className="sticky top-0 z-10">
            <div className="flex items-center justify-between px-5 h-16 bg-gradient-to-r from-violet-50 to-pink-50">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex items-center justify-center rounded-xl 
                    bg-gradient-to-br from-violet-500 to-pink-500 
                    text-white font-bold text-lg shadow-md">
                  OZ
                </div>
                <span className="font-extrabold text-lg bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                  오즈의 이상한 상점
                </span>
                </div>
              <button 
                aria-label="닫기" 
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                onClick={onClose}
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitSearch();
                onClose();
              }}
              className="px-5 py-3 bg-white/95 backdrop-blur"
            >
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={keyword || ""}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="어떤 상품을 찾으시나요?"
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-black/15 focus:border-gray-300 bg-gray-50"
                  />
                  {!!keyword && (
                    <button
                      type="button"
                      onClick={() => setKeyword("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      지우기
                    </button>
                  )}
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                  <Sparkles className="w-4 h-4" /> 추천 검색어
                </span>
                {SUGGEST_ALL.slice(0, 10).map((tag) => (
                  <button
                    key={`tag-${String(tag)}`}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                    onClick={() => {
                      onSelectSub(null, tag);
                      onClose();
                    }}
                  >
                    {tag}
                  </button>
                ))}
                {!SUGGEST_ALL.length && (
                  <span className="text-xs text-gray-400">추천어가 없습니다</span>
                )}
              </div>
            </form>
          </div>

            <div className="px-5 py-2 divide-y overflow-y-auto scrollbar-hide">
              {PRIMARY_SAFE.map((p) => {
                const pKey =
                  typeof p === "string"
                    ? p.toUpperCase()
                    : String(p.key ?? p.label ?? "").toUpperCase();
                const pLabel =
                  typeof p === "string"
                    ? p
                    : String(p.label ?? p.key ?? "");
                const meta = META[pKey] ?? { emoji: "🛍️", bar: "from-gray-200 to-gray-100" };

                const isOpen = openPrimary === pKey;
                return (
                  <div 
                    key={`primary-${pKey}`} 
                    className="group rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm mt-3"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenPrimary(isOpen ? null : pKey)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{meta.emoji}</span>
                          <span className="text-[15px] font-semibold">{pLabel}</span>
                        </div>
                          <motion.span 
                            className="text-xs text-gray-500 group-open:rotate-180 transition-transform"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ type: "tween", duration: 0.18 }}
                          >
                            ▾
                          </motion.span>
                        </div>
                      <div className={`h-1 w-full bg-gradient-to-r ${meta.bar}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={`panel-${pKey}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="pl-3 pb-2 grid grid-cols-2 gap-2 pt-3"
                            variants={staggerCols}
                            initial="initial"
                            animate="animate"
                          >
                            {(SUBS_SAFE[pKey] ?? []).flatMap((col, idx) =>
                              (col?.items ?? []).map((item) => {
                                const itemLabel = String(item);
                                return (
                                  <motion.button
                                    key={`sub-${pKey}-${idx}-${itemLabel}`}
                                    className="text-[14px] text-left px-3 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 active:scale-[0.99] transition
                                                flex items-center justify-between"
                                    onClick={() => {
                                      onSelectSub(pKey, itemLabel);
                                      onClose();
                                    }}
                                    variants={colItem}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span className="truncate">{itemLabel}</span>
                                    <span className="text-gray-300">›</span>
                                  </motion.button>
                                );
                              })
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {!PRIMARY_SAFE.length && (
                <div className="py-6 text-sm text-gray-500">카테고리가 비어 있습니다.</div>
              )}
            </div>

            <div className="mt-auto bg-white/95 backdrop-blur shadow-[0_-2px_12px_rgba(0,0,0,0.05)] px-5 py-3">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50 active:scale-[0.99] transition"
                    onClick={() => { onClose(); navigate("/login"); }}
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="text-sm font-medium">로그인</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-black text-white py-2.5 hover:opacity-90 active:scale-[0.99] transition"
                    onClick={() => { onClose(); navigate("/signup"); }}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-sm font-medium">회원가입</span>
                  </button>
                </div>
              ) : (
              <div className="mt-auto bg-white/95 backdrop-blur px-5 py-3 space-y-2">
                {isAdmin && (
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 hover:bg-amber-100 active:scale-[0.99] transition"
                    onClick={() => { onClose(); navigate("/admin"); }}
                  >
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">관리자 페이지로 이동하기</span>
                  </button>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50 active:scale-[0.99] transition px-3"
                    onClick={() => { onClose(); navigate("/mypage"); }}
                  >
                    <User className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-medium whitespace-nowrap tracking-tight leading-none">마이페이지</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50 active:scale-[0.99] transition px-3"
                    onClick={() => { onClose(); navigate("/cart"); }}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-medium whitespace-nowrap tracking-tight leading-none">장바구니</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2.5 hover:bg-gray-50 active:scale-[0.99] transition px-3"
                    onClick={() => { onClose(); navigate("/wishlist"); }}
                  >
                    <Heart className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="text-[12px] font-medium whitespace-nowrap tracking-tight leading-none">위시리스트</span>
                  </button>
                </div>
                  <button
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border text-white py-2.5 bg-black active:scale-[0.99] transition"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">로그아웃</span>
                  </button>
              </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
