import { createPortal } from 'react-dom';
import { ArrowDownAZ, ArrowUpAZ, Check } from 'lucide-react';

export default function SortMenuPortal({ anchorRef, open, ordering, onSelect, onClose }) {
  if (!open || !anchorRef?.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();
  const menuWidth = 192; 
  const gap = 8;

  const style = {
    position: 'fixed',
    top: rect.bottom + gap,
    left: Math.max(8, rect.right - menuWidth),
    width: menuWidth,
    zIndex: 1000,
  };

  const Item = ({ value, label, up }) => {
    const active = ordering === value;
    return (
      <button
        type="button"
        onClick={() => {
          onSelect(value);
          onClose?.();
        }}
        className={
          'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm ' +
          (active ? 'bg-violet-50 text-violet-700' : 'hover:bg-gray-50')
        }
      >
        <span className="flex items-center gap-2">
          {up ? <ArrowUpAZ className="w-4 h-4 opacity-70" /> : <ArrowDownAZ className="w-4 h-4 opacity-70" />}
          {label}
        </span>
        {active && <Check className="w-4 h-4 opacity-80" />}
      </button>
    );
  };

  return createPortal(
    <div
      id="sort-menu-portal"
      style={style}
      className="origin-top-right rounded-xl border border-black/10 bg-white shadow-xl ring-1 ring-black/5
                 animate-[fadeIn_.12s_ease-out] overflow-hidden"
    >
      <div className="py-1">
        <Item value="-updated_at" label="최신 수정순" up={false} />
        <Item value="updated_at" label="최신 수정순" up={true} />
        <div className="my-1 h-px bg-gray-100" />
        <Item value="-stock_quantity" label="재고 많은 순" up={false} />
        <Item value="stock_quantity" label="재고 적은 순" up={true} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
