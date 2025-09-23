import { motion, AnimatePresence } from "framer-motion";
import Row from "./Row";

const listContainer = { animate: { transition: { staggerChildren: 0.05 } } };

export default function List({
  items,
  selected,
  onToggleOne,
  onAddOne,
  onRemoveOne,
  onImgRefById,
}) {
  return (
    <motion.ul
      className="rounded-2xl border border-neutral-200 bg-white"
      variants={listContainer}
      initial="initial"
      animate="animate"
      layout
    >
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const active = selected.has(item.id);
          return (
            <Row
              key={item.id}
              item={item}
              active={active}
              onToggle={() => onToggleOne(item.id)}
              onAddOne={() => onAddOne(item.id)}
              onRemoveOne={() => onRemoveOne(item.id)}
              onImgRef={(el) => onImgRefById(item.id, el)}
            />
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}
