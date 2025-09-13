import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function RequestDecisionModal({ open, onClose, order, onApprove, onReject }) {
  const [adminNote, setAdminNote] = useState("");
  useEffect(() => setAdminNote(""), [open]);

  if (!order || !order.request) return null;

  const isCancel = order.request.type === "cancel";
  const title = isCancel ? "취소 요청 처리" : "환불 요청 처리";
  const requestLabel = isCancel ? "취소 사유" : "환불 사유";

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              주문번호 <span className="font-medium text-gray-700">{order.orderNo}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">{requestLabel}</div>
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-800">
              {order.request.reason || "-"}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">관리자 메모 (선택)</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="처리 사유 또는 참고 메모를 입력하세요."
              className="w-full min-h-[140px] rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm resize-y"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
          <button onClick={() => onReject?.(adminNote)} className="h-11 rounded-xl bg-gray-200 px-5 text-sm font-semibold text-gray-800 hover:bg-gray-300">
            거절
          </button>
          <button onClick={() => onApprove?.(adminNote)} className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700">
            승인
          </button>
        </div>
      </div>
    </Modal>
  );
}
