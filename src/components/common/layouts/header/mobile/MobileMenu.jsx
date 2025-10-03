import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Sparkle } from "lucide-react";
import { spring, staggerCols, colItem } from "../animations";
import { PRIMARY, SUGGEST, SUBS } from "../constants";

const noop = () => {};

export default function MobileMenu({
  open,
  keyword,
  setKeyword = noop,
  onClose = noop,
  onSubmitSearch = noop,
  onSelectSub = noop,
}) {

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
            className="md:hidden fixed inset-y-0 left-0 z-[60] w-[88%] max-w-[420px] bg-white text-black shadow-2xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0, transition: spring }}
            exit={{ x: "-100%", transition: { duration: 0.15 } }}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b bg-gradient-to-r from-violet-50 to-pink-50">
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
              className="px-5 pt-3 pb-2"
            >
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={keyword || ""}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="어떤 상품을 찾으시나요?"
                  className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </form>

            <div className="px-5 pb-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">추천 검색어</div>
              <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="px-5 py-2 divide-y overflow-y-auto">
              {PRIMARY_SAFE.map((p) => {
                // p: "MEN" 또는 { key:"MEN", label:"남성", ... }
                const pKey =
                  typeof p === "string"
                    ? p.toUpperCase()
                    : String(p.key ?? p.label ?? "").toUpperCase();
                const pLabel =
                  typeof p === "string"
                    ? p
                    : String(p.label ?? p.key ?? "");

                return (
                  <details key={`primary-${pKey}`} className="py-2">
                    <summary className="cursor-pointer text-lg font-semibold py-2">
                      {pLabel}
                    </summary>

                    <motion.div
                      className="pl-3 pb-2 grid grid-cols-2 gap-2"
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
                              className="text-sm text-left px-2 py-1 rounded hover:bg-black/5"
                              onClick={() => {
                                onSelectSub(pKey, itemLabel);
                                onClose();
                              }}
                              variants={colItem}
                              whileTap={{ scale: 0.98 }}
                            >
                              {itemLabel}
                            </motion.button>
                          );
                        })
                      )}
                    </motion.div>
                  </details>
                );
              })}

              {!PRIMARY_SAFE.length && (
                <div className="py-6 text-sm text-gray-500">카테고리가 비어 있습니다.</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
