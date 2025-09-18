import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  open,
  onClose,
  title,
  header,
  children,
  footer,
  maxWidth = "max-w-3xl",
  overlayClosable = true,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={overlayClosable ? onClose : undefined}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {(header || title || onClose) && (
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
            <div className="min-w-0 flex-1">
              {header ? (
                header
              ) : (
                <h3 id="modal-title" className="text-base font-semibold text-slate-900">
                  {title}
                </h3>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-3 rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 shrink-0"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="px-5 py-5">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
