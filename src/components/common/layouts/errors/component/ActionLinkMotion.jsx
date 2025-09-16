import { motion } from "framer-motion";

export default function ActionLinkMotion({ href, icon, children }) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-2 h-11 rounded-xl bg-gray-900 text-white px-4 text-sm font-medium hover:bg-gray-800"
    >
      {icon}
      <span>{children}</span>
    </motion.a>
  );
}
