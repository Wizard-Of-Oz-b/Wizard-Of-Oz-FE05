import { AnimatePresence, motion } from "framer-motion";

const SUBS = {
  WOMEN: ["아우터", "탑", "팬츠", "원피스", "ACC"],
  MEN:   ["아우터", "셔츠", "팬츠", "니트", "ACC"],
  KIDS:  ["후디", "팬츠", "셔츠", "세트", "ACC"],
  SALE:  ["오늘의 특가", "시즌오프", "아울렛"],
};

export default function HeroSubmenuOverlay({ primary, onClose, onSelectSub }) {
  return (
    <AnimatePresence initial={false} mode="wait">
      {primary && (
        <motion.div
          key={primary}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed left-0 right-0 top-[64px] z-[90] px-4"
        >
          <div className="mx-auto max-w-6xl rounded-2xl bg-white/90 text-gray-900 shadow-2xl backdrop-blur p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{primary}</h3>
              <button onClick={onClose} className="text-sm text-gray-600 hover:text-black" aria-label="닫기">✕</button>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {(SUBS[primary] || []).map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSub?.(s)}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}