import React from "react";
import { motion } from "framer-motion";
import { staggerCols, colItem } from "../animations";
import { SUBS } from "../constants";

export default function CategoryGrid({ active, onSelectSub }) {
  return (
    <motion.div className="mx-auto max-w-[120rem] px-6 pb-6 grid grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerCols} initial="initial" animate="animate">
      {(SUBS[active] || []).map((col) => (
        <motion.div key={col.title} className="min-w-0" variants={colItem}>
          <div className="text-sm font-bold mb-3 text-gray-700">{col.title}</div>
          <ul className="space-y-2">
            {col.items.map((item) => (
              <li key={item}>
                <motion.button
                  className="text-sm hover:text-red-500 transition cursor-pointer"
                  onClick={() => onSelectSub(active, item)}
                  whileHover={{ x: 2 }}
                  transition={{ type: "tween", duration: 0.12 }}
                >
                  {item}
                </motion.button>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
