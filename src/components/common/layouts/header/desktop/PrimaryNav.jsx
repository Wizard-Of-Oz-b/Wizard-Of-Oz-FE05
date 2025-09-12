import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "../animations";
import { PRIMARY } from "../constants";

export default function PrimaryNav({ isLight, active, open }) {
  return (
    <nav className="hidden md:flex gap-20 text-2xl font-semibold">
      {PRIMARY.map((p) => (
        <motion.div
          key={p}
          onMouseEnter={() => open(p)}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <button className={`hover:opacity-80 ${isLight ? "text-black" : "text-white"} tracking-wider`}>
            {p}
          </button>
          <motion.span
            layoutId="nav-underline"
            className="absolute left-0 -bottom-1 h-0.5"
            style={{ backgroundColor: isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }}
            animate={{ width: active === p ? "100%" : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        </motion.div>
      ))}
    </nav>
  );
}
