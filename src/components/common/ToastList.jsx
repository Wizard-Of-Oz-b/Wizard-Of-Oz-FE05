import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "../../store/toast";
import { Check } from "lucide-react";

// kyeongbok님 코드 참조
export default function ToastList() {
  const { toastList } = useToastStore();
  console.log(toastList, '토스트')
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-2">
      <AnimatePresence>
        {toastList?.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm"
          >
            <Check className="h-4 w-4" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
