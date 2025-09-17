import React from "react";
import { motion } from "framer-motion";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RightIcons({ isLight, onOpenSearch }) {
  const navigate = useNavigate();
  const base = isLight ? "hover:opacity-80 text-black" : "hover:opacity-80 text-white";
  return (
    <motion.div
      className="flex items-center gap-4 text-xl"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.06 } }}
    >
      <button aria-label="Search" className={base} onClick={onOpenSearch}>
        <Search className="w-7 h-7" />
      </button>
      <button aria-label="Wishlist"
              className={base}
              onClick={() => navigate("/wishlist")}
              >
        <Heart className="w-7 h-7" />
      </button>
      <button
  aria-label="Account"
  className={base}
  onClick={() => navigate("/mypage")}
>
  <User className="w-7 h-7" />
</button>

      <button aria-label="Cart" className={base}>
        <ShoppingCart className="w-7 h-7 cursor-pointer hover:scale-110 hover:opacity-80 transition" />
      </button>
    </motion.div>
  );
}
