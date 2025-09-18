import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Toast({ message, kind = "info", onClose, duration = 2200 }) {
  const [open, setOpen] = useState(Boolean(message));

  useEffect(() => {
    setOpen(Boolean(message));
    if (!message) return;
    const t = setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!open) return null;
  const base =
    kind === "error"
      ? "bg-rose-600 ring-rose-700/50"
      : kind === "success"
      ? "bg-emerald-600 ring-emerald-700/50"
      : "bg-slate-800 ring-slate-900/50";

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <div
          className={`pointer-events-auto text-white ${base} backdrop-blur px-4 py-2.5 rounded-xl shadow-2xl ring-1 animate-[toastIn_.2s_ease-out]`}
          style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.03) inset" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm leading-5">{message}</span>
            <button onClick={() => { setOpen(false); onClose?.(); }} className="text-white/85 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}