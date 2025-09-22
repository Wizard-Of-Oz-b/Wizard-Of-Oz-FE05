import { motion } from "framer-motion";

export default function StarRating({
  value = 0,
  onChange,
  size = 20,
  readOnly = false,
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      {stars.map((s) => {
        const filled = s <= Math.round(value);
        return (
          <motion.button
            key={s}
            type="button"
            className="p-0.5"
            whileTap={{ scale: 0.85, rotate: -10 }}
            whileHover={!readOnly ? { scale: 1.2 } : {}}
            animate={filled ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={
              !readOnly && onChange ? () => onChange(s) : undefined
            }
            aria-label={`${s}점`}
            disabled={readOnly}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className={
                filled
                  ? "fill-yellow-400 stroke-yellow-500"
                  : "fill-none stroke-gray-300"
              }
            >
              <path
                strokeWidth="1.5"
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}
