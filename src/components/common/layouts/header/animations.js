export const spring = { type: "spring", stiffness: 260, damping: 24 };

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
};

export const dropPanel = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
  exit: { opacity: 0, y: -6, scale: 0.995, transition: { duration: 0.12 } },
};

export const staggerCols = {
  initial: { opacity: 1 },
  animate: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

export const colItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.16 } },
};
