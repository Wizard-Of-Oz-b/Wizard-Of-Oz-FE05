import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      className="grid place-items-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16"
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
    >
      <Heart className="mb-3 h-8 w-8 text-neutral-400" />
      <div className="text-center">
        <p className="text-base font-medium">위시리스트가 비어 있어요</p>
        <p className="mt-1 text-sm text-neutral-500">마음에 드는 상품을 위시에 추가해 보세요.</p>
      </div>
    </motion.div>
  );
}
