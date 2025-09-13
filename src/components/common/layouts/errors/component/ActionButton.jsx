import { motion } from "framer-motion";

export default function ActionButton({
  onClick,
  icon,
  children,
  className = "",
  type = "button",
  disabled = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { y: -1, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={[
        "inline-flex items-center gap-2 h-11 rounded-xl px-4 text-sm font-medium",
        "bg-white text-gray-700 border hover:bg-gray-50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
        disabled && "opacity-60 pointer-events-none",
        className,
      ].join(" ")}
      aria-disabled={disabled || undefined}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  );
}
