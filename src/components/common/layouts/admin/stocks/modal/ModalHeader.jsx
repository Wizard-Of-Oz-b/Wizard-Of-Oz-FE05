import { X, Check } from 'lucide-react';

export default function ModalHeader({ phase, onClose }) {
  return (
    <div className="relative flex items-center justify-between px-6 py-4 bg-white/80 rounded-t-3xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow">
          <Check className="w-4 h-4" />
        </span>
        <div className="font-semibold tracking-wide">
          {phase === 'search' ? '재고 추가 · 상품 선택' : '재고 추가 · 옵션 선택'}
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        aria-label="닫기"
      >
        <X className="w-5 h-5 text-slate-700" />
      </button>
    </div>
  );
}
