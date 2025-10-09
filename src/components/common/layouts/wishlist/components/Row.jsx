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
      initial="initial"
      animate="animate"
      exit="exit"
      layout="position"
      transition={{ layout: { duration: 0.18, ease: "easeOut" } }}
      className={`group px-3 sm:px-4 py-4 mx-2 my-2 rounded-xl transition
        ${active ? "bg-neutral-50 ring-1 ring-neutral-200" : "hover:bg-neutral-50"}`}
    >
      {/* ───────── 데스크톱이라네 ───────── */}
      <div className="hidden md:grid md:grid-cols-12 items-center gap-4">
      {/* 체크박스 */}
      <div className="col-span-1 flex items-center justify-start">
        <input
          type="checkbox"
          checked={active}
          onChange={onToggle}
          className="h-4 w-4 accent-black"
          aria-label={`${item.title} 선택`}
        />
      </div>

      {/* 이미지 */}
      <div className="col-span-1 sm:col-span-2 md:col-span-2 flex justify-start">
        <div className="relative w-24 sm:w-28 md:w-36 aspect-[3/4] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          <img
            ref={onImgRef}
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>
      </div>

      {/* 정보 */}
      <div className="col-span-2 md:col-span-5">
        <p className="line-clamp-2 text-sm font-medium tracking-tight">{item.title}</p>
        <span className="mt-2 inline-flex items-center rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600">
          {item.optionsText || "-"}
        </span>
      </div>

      {/* 가격 */}
      <div className="col-span-1 md:col-span-2 text-left md:text-right">
        <p className="text-sm font-semibold tracking-tight">{formatPrice(item.price)}원</p>
      </div>

      {/* 액션 */}
      <div className="col-span-2 sm:col-span-4 md:col-span-2 flex flex-wrap md:flex-nowrap justify-end gap-2 mt-2 md:mt-0">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddOne}
          className="inline-flex h-9 items-center gap-1 rounded-lg bg-black px-3 text-xs text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
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
      </div>

      {/* ───────── 모바일 전용 카드형 ───────── */}
      <div className="md:hidden grid grid-cols-[88px_1fr] items-start gap-3">
        <div className="relative">
          <label className="absolute top-1.5 left-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/90 shadow ring-1 ring-neutral-200">
            <input
              type="checkbox"
              checked={active}
              onChange={onToggle}
              className="h-4 w-4 accent-black"
              aria-label={`${item.title} 선택`}
            />
          </label>
          <div className="relative w-[88px] aspect-[3/4] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
            <img
              ref={onImgRef}
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
        </div>
        <div>
          <p className="line-clamp-2 text-[15px] font-medium tracking-tight">{item.title}</p>
          <span className="mt-2 inline-flex items-center rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600">
            {item.optionsText || "-"}
          </span>
          <p className="mt-2 text-sm font-semibold tracking-tight">{formatPrice(item.price)}원</p>
          <div className="mt-2 flex gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAddOne}
              className="flex-1 inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-black px-3 text-xs text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <ShoppingCart className="h-4 w-4" /> 담기
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onRemoveOne}
              className="flex-1 inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-neutral-300 px-3 text-xs hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <Trash2 className="h-4 w-4" /> 삭제
            </motion.button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
