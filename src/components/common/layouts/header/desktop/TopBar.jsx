import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ isLight, onOpenMobile }) {
  const navigate = useNavigate("");

  return (
    <div className="flex items-center gap-3">
      <button
        className={["md:hidden p-2 rounded transition-colors", isLight ? "hover:bg-black/5" : "hover:bg-white/10"].join(" ")}
        aria-label="메뉴 열기"
        onClick={onOpenMobile}
      >
        <Menu className="w-7 h-7" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
        className="text-3xl font-bold whitespace-nowrap cursor-pointer"
        onClick={() => navigate("/")}
      >
        오즈의 이상한 상점
      </motion.div>
    </div>
  );
}
