//ROW에서 Card형으로 변경합니다.

import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

const formatPrice = (n) => n.toLocaleString("ko-KR");

export default function CardItem({
  item,
  active,
  onToggle,
  onAddOne,
  onRemoveOne,
  onImgRef,
}) {
  const navigate = useNavigate();
  const handleGoDetail = () => navigate(`/products/${item.productId}`);

  return (
    <motion.li
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`group rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md transition ${
        active ? "ring-2 ring-violet-300" : ""
      }`}
    >
      {/* 이미지 */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 aspect-[4/5]">
        {/* 체크박스 */}
        <label className="absolute top-2 left-2 z-10 inline-flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-white/90 shadow ring-1 ring-neutral-200">
          <input
            type="checkbox"
            checked={active}
            onChange={onToggle}
            className="h-5 w-5 sm:h-4 sm:w-4 accent-violet-600"
            aria-label={`${item.title} 선택`}
          />
        </label>

        {/* 디테일페이지로 이동 */}
        <button
          type="button"
          onClick={handleGoDetail}
          className="cursor-pointer absolute inset-0"
          aria-label={`${item.title} 상세 보기`}
        >
          <img
            ref={onImgRef}
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </button>
      </div>

      {/* 정보 */}
      <p
        onClick={handleGoDetail}
        className="mt-3 line-clamp-2 text-[13.5px] sm:text-sm font-medium tracking-tight text-neutral-900 cursor-pointer hover:underline"
      >
        {item.title}
      </p>

      <span className="mt-2 inline-flex items-center rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] sm:text-xs text-neutral-600 break-keep whitespace-normal">
        {item.optionsText || "-"}
      </span>

      <p className="mt-2 text-sm sm:text-base font-semibold tracking-tight text-neutral-900">
        {formatPrice(item.price)}원
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddOne}
          className="inline-flex h-11 sm:h-9 w-full sm:w-auto items-center justify-center gap-1 rounded-lg bg-black px-3 text-sm sm:text-xs font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>담기</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRemoveOne}
          className="inline-flex h-11 sm:h-9 w-full sm:w-auto items-center justify-center gap-1 rounded-lg border border-neutral-300 px-3 text-sm sm:text-xs font-semibold hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          <Trash2 className="h-4 w-4" />
          <span>삭제</span>
        </motion.button>
      </div>
    </motion.li>
  );
}
