import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import { NEXT_ALLOWED } from "../../../../features/admin/orders/constants";

const ADMIN_SUPPORTED = new Set(["취소완료", "환불완료"]);

export default function StatusChangeModal({ open, onClose, order, onConfirm }) {
  const [next, setNext] = useState("");

  useEffect(() => {
    if (!order) return;
    const allowed = (NEXT_ALLOWED[order.status] || []).filter((s) => ADMIN_SUPPORTED.has(s));
    setNext(allowed[0] || "");
  }, [order, open]);

  if (!open || !order) return null;

  const allowed = (NEXT_ALLOWED[order.status] || []).filter((s) => ADMIN_SUPPORTED.has(s));

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6 md:p-7">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">주문 상태 변경</h3>
        <p className="mt-1 text-sm text-gray-500">
          주문번호 <span className="font-medium text-gray-700">{order.orderNo}</span>
        </p>

        <div className="mt-5 space-y-2">
          <div className="text-xs text-gray-500">현재 상태</div>
          <StatusBadge status={order.status} />
        </div>

        <div className="mt-5">
          <label className="text-xs text-gray-500">다음 상태 선택</label>
          <select
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          >
            {allowed.length === 0
              ? <option value="">(서버 지원 상태 없음)</option>
              : allowed.map((s) => <option key={s} value={s}>{s}</option>)
            }
          </select>
          {allowed.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">취소/환불 완료만 서버에서 변경 가능합니다.</p>
          )}
        </div>

        <div className="mt-7 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">취소</button>
          <button
            onClick={() => { if (!next) return; onConfirm?.(next); }}
            disabled={!next}
            className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}
