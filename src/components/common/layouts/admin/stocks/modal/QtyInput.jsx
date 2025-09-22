import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function QtyInput({ value, onChange, className = '' }) {
  const set = (v) => onChange?.(String(Math.max(0, Number(v) || 0)));
  return (
    <div className={`inline-flex items-center rounded-xl ring-1 ring-slate-200 bg-white overflow-hidden shadow-sm ${className}`}>
      <button
        type="button"
        onClick={() => set((Number(value) || 0) - 1)}
        className="h-9 w-9 grid place-items-center hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        aria-label="수량 감소"
      >
        <ChevronLeft className="w-4 h-4 text-slate-600" />
      </button>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => set(e.target.value)}
        className="h-9 w-16 text-right px-2 outline-none border-0"
      />
      <button
        type="button"
        onClick={() => set((Number(value) || 0) + 1)}
        className="h-9 w-9 grid place-items-center hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        aria-label="수량 증가"
      >
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
