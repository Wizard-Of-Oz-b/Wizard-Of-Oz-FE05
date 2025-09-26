import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Accordion({ items = [] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-white/10">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={idx} className="py-2">
            <button
              onClick={() => setOpen(isOpen ? -1 : idx)}
              className="cursor-pointer flex items-center justify-between w-full"
            >
              <span className="font-medium text-white">{it.q}</span>
              <span
                className={`transition-transform duration-300 text-admintheme-violet-light ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-sm text-admintheme-violet-light">
                    {it.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
