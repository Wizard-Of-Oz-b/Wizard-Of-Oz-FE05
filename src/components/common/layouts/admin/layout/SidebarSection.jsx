import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const collapseVariants = {
  collapsed: { height: 0, opacity: 0 },
  open:      { height: 'auto', opacity: 1 },
};

export default function SidebarSection({ id, title, open, onToggle, children, dense = false }) {
  return (
    <div className="rounded-xl border border-admintheme-violet-dark/60">
      <button
        onClick={() => onToggle(id)}
        className={`w-full flex items-center justify-between px-3 ${dense ? 'py-2' : 'py-2.5'} rounded-t-xl text-sm font-semibold text-admintheme-white hover:bg-admintheme-violet-dark`}
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`${id}-body`}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={collapseVariants}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
