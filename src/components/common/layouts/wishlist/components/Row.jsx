import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";

const rowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.18 } },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function Row({
  item,
  active,
  onToggle,
  onAddOne,
  onRemoveOne,
  onImgRef,
}) {
  return (
    <motion.li
      variants={rowVariants}
      exit="exit"
      layout
      className={`group grid grid-cols-12 items-center gap-4 px-4 py-4 transition ${
        active ? "bg-neutral-50 ring-1 ring-neutral-200 rounded-xl mx-2 my-2" : "hover:bg-neutral-50"
      }`}
    >
      {/* 체크박스 */}
      <div className="col-span-1 flex items-center">
        <input
          type="checkbox"
          checked={active}
          onChange={onToggle}
          className="h-4 w-4 accent-black"
          aria-label={`${item.title} 선택`}
        />
      </div>

      {/* 이미지 */}
      <div className="col-span-2">
        <div className="relative aspect-[3/4] w-36 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          <img
            ref={onImgRef}
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* 정보 */}
      <div className="col-span-5">
        <p className="line-clamp-2 text-sm font-medium tracking-tight">{item.title}</p>
        <span className="mt-2 inline-flex items-center rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600">
          {item.optionsText || "-"}
        </span>
      </div>

      {/* 가격 */}
      <div className="col-span-2 text-right">
        <p className="text-sm font-semibold tracking-tight">{formatPrice(item.price)}원</p>
      </div>

      {/* 액션 */}
      <div className="col-span-2 flex justify-end gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddOne}
          className="relative inline-flex h-9 items-center gap-1 rounded-lg bg-black px-3 text-xs text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <ShoppingCart className="h-4 w-4" /> 담기
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRemoveOne}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-300 px-3 text-xs hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <Trash2 className="h-4 w-4" /> 삭제
        </motion.button>
      </div>
    </motion.li>
  );
}
