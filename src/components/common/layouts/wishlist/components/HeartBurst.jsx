import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeartBurst({ show = false, onDone }) {
  const [visible, setVisible] = useState(show);
  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  const particles = Array.from({ length: 6 });

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none absolute inset-0">
          {particles.map((_, i) => {
            const angle = (i / particles.length) * Math.PI * 2;
            const dx = Math.cos(angle) * 24; // 퍼짐 반경
            const dy = Math.sin(angle) * 24 - 12;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                animate={{ opacity: 1, x: dx, y: dy, scale: 1, rotate: 10 }}
                exit={{ opacity: 0, y: dy - 10, scale: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              </motion.span>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
