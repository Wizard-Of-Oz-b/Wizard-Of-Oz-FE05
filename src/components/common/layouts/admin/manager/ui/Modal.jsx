import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-b from-white/90 to-white/75 shadow-2xl"
          style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,.5)" }}
        >
          <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer && <div className="px-5 py-4 border-t border-black/5 bg-white/60 rounded-b-2xl">{footer}</div>}
        </div>
      </div>
    </div>
  );
}