import React from "react";
import { motion } from "framer-motion";
import { staggerCols, colItem } from "../animations";

export default function SuggestionsRow({ tags, onClick }) {
  return (
    <motion.div className="mx-auto max-w-[120rem] px-6 pt-3 pb-2 flex flex-wrap gap-2" variants={staggerCols} initial="initial" animate="animate">
      {tags.slice(0, 10).map((tag) => (
        <motion.button
          key={tag}
          className="px-3 py-1.5 rounded-full bg-gray-100 text-sm hover:bg-gray-200"
          onClick={() => onClick(tag)}
          variants={colItem}
          whileTap={{ scale: 0.98 }}
        >
          {tag}
        </motion.button>
      ))}
    </motion.div>
  );
}
