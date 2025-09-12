import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { spring, staggerCols, colItem } from "../animations";
import { PRIMARY, SUGGEST, SUBS } from "../constants";

export default function MobileMenu({
  open,
  keyword,
  setKeyword,
  onClose,
  onSubmitSearch,
  onSelectSub,
}) {
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
            <div className="flex items-center justify-between px-5 h-14 border-b">
              <div className="font-semibold">메뉴</div>
              <button aria-label="닫기" className="p-2 rounded hover:bg-black/5" onClick={onClose}>
                <X className="w-6 h-6" />
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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="어떤 상품을 찾으시나요?"
                  className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </form>

            <div className="px-5 pb-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">추천 검색어</div>
              <div className="flex flex-wrap gap-2">
                {SUGGEST.ALL.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
                    onClick={() => {
                      onSelectSub(null, tag);
                      onClose();
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-2 divide-y overflow-y-auto">
              {PRIMARY.map((p) => (
                <details key={p} className="py-2">
                  <summary className="cursor-pointer text-lg font-semibold py-2">{p}</summary>
                  <motion.div className="pl-3 pb-2 grid grid-cols-2 gap-2" variants={staggerCols} initial="initial" animate="animate">
                    {(SUBS[p] || []).flatMap((col) =>
                      col.items.map((item) => (
                        <motion.button
                          key={`${p}-${item}`}
                          className="text-sm text-left px-2 py-1 rounded hover:bg-black/5"
                          onClick={() => {
                            onSelectSub(p, item);
                            onClose();
                          }}
                          variants={colItem}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item}
                        </motion.button>
                      ))
                    )}
                  </motion.div>
                </details>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
