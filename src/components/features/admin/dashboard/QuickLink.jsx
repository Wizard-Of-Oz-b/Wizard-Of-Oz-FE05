// 버튼 클릭시 애니메이션 효과 지정

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuickLink({ to, icon, children }) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        group flex items-center justify-between 
        rounded-xl backdrop-blur-md border border-white/10 
        px-3 py-2 cursor-pointer 
        bg-admintheme-violet/40 hover:bg-admintheme-violet/60 
        transition-colors
      "
    >
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="inline-flex items-center justify-center rounded-md bg-admintheme-violet-dark/60 p-1.5">
          {icon}
        </span>
        {children}
      </div>
      <motion.span
        className="text-admintheme-violet-light group-hover:text-white"
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
      >
        →
      </motion.span>
    </motion.div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}
