import React from "react";
import { motion } from "framer-motion";
import { staggerCols, colItem } from "../animations";

export default function FooterLinks({ items, onClick }) {
  return (
    <motion.div className="mx-auto max-w-[120rem] px-6 pb-5 flex items-center gap-4 text-sm text-gray-600" variants={staggerCols} initial="initial" animate="animate">
      {items.map((txt) => (
        <motion.button key={txt} className="hover:text-black" variants={colItem} onClick={() => onClick?.(txt)}>
          {txt}
        </motion.button>
      ))}
    </motion.div>
  );
}
