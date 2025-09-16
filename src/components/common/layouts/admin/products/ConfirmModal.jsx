import Modal from "../common/Modal";
import { CheckCircle2, Info, XCircle } from "lucide-react";

export default function ConfirmModal({
  open,
  onClose,
  title = "",
  description = "",
  variant = "default",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  maxWidth = "max-w-md",
}) {
  if (!open) return null;

  const isConfirm = typeof onConfirm === "function";

  const tone =
    variant === "success"
      ? "bg-emerald-600"
      : variant === "error"
      ? "bg-rose-600"
      : variant === "warning"
      ? "bg-amber-600"
      : "bg-slate-800";

  const ConfirmBtnTone =
    variant === "error"
      ? "bg-rose-600 hover:bg-rose-700"
      : variant === "success"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-gray-900 hover:bg-black";

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? XCircle : Info;

  return (
    <Modal open={open} onClose={onClose} maxWidth={maxWidth}>
      <div role="dialog" aria-modal="true" className="p-6">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center rounded-full ${tone} text-white w-6 h-6`}>
            <Icon className="w-4 h-4" />
          </span>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>

        {description ? (
          <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">{description}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          {isConfirm ? (
            <>
              <button
                onClick={onClose}
                className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`h-10 rounded-xl px-5 text-sm font-semibold text-white ${ConfirmBtnTone}`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`h-10 rounded-xl px-5 text-sm font-semibold text-white ${ConfirmBtnTone}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
