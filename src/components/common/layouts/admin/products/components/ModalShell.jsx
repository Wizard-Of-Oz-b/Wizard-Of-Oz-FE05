import { X } from "lucide-react";

export default function ModalShell({ open, onClose, title, subtitle, icon, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex-none px-6 py-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-gray-100" aria-label="닫기">
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 md:px-7 md:py-7">
          {children}
        </div>

        {/* Footer */}
        <div className="flex-none px-6 py-4 border-t border-gray-100 bg-white">
          {footer}
        </div>
      </div>
    </div>
  );
}
