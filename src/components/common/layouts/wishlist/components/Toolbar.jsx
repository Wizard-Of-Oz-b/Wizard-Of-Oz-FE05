import React, { useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Toolbar({
  allChecked,
  indeterminate,
  selectedCount,
  totalCount,
  onToggleAll,
  onRemoveSelected,
  onAddSelected,
}) {
  const masterRef = useRef(null);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <motion.div
      className="sticky top-4 z-10 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm"
      initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            ref={masterRef}
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            className="h-4 w-4 accent-black"
          />
          전체 선택
        </label>
        <span className="text-xs text-neutral-500">선택 {selectedCount} / 전체 {totalCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRemoveSelected}
          className="h-9 rounded-xl border border-neutral-300 px-3 text-sm text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          선택항목 삭제
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddSelected}
          className="h-9 inline-flex items-center gap-2 rounded-xl bg-black px-4 text-sm text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <ShoppingCart className="h-4 w-4" /> 선택 담기
        </motion.button>
      </div>
    </motion.div>
  );
}
