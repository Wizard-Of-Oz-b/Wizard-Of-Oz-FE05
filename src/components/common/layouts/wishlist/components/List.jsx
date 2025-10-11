import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";

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
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4"
      variants={listContainer}
      initial="initial"
      animate="animate"
      layout
    >
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const active = selected.has(item.id);
          return (
            <Card
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
