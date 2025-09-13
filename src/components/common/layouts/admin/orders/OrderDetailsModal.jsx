import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import StatusSelect from "./StatusSelect";

export default function OrderDetailsModal({
  open,
  onClose,
  order,
  onSaveContact,
  onSaveTracking,
  onOpenRequestModal,
  onChangeStatus,
}) {
  const [form, setForm] = useState({ customer: "", phone: "", address: "", note: "" });
  const [carrier, setCarrier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");

  useEffect(() => {
    if (!order) return;
    setForm({
      customer: order.customer || "",
      phone: order.phone || "",
      address: order.address || "",
      note: order.note || "",
    });
    setCarrier(order.carrier || "");
    setTrackingNo(order.trackingNo || "");
  }, [order]);

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-5xl">
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">주문 상세</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              주문번호 <span className="font-medium text-gray-700">{order.orderNo}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <StatusSelect value={order.status} onChange={(next) => onChangeStatus?.(order.id, next)} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 고객/배송 정보 */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold mb-4">고객 & 배송 정보</h4>
              <div className="space-y-4">
                {[
                  ["고객명", "customer"],
                  ["연락처", "phone"],
                  ["주소", "address"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <div className="text-xs text-gray-500 mb-1.5">{label}</div>
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                    />
                  </div>
                ))}
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">요청사항</div>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                    className="w-full min-h-[160px] rounded-xl bg-gray-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm resize-y"
                    placeholder="부재 시 문앞, 경비실 등"
                  />
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => onSaveContact?.(order.id, form)}
                    className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                  >
                    배송지/연락처 저장
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 주문 품목 + 운송장 */}
          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold mb-4">주문 품목</h4>
              <ul className="divide-y divide-gray-100">
                {order.items.map((it) => (
                  <li key={it.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={it.image_url} alt={it.name} className="h-14 w-14 rounded-md object-cover shadow-sm" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">옵션: {it.option || "-"} · 수량 {it.qty}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-semibold text-gray-800">
                      {(it.price * it.qty).toLocaleString()}원
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold mb-4">운송장 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="택배사 (예: CJ대한통운)"
                  className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                />
                <input
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="운송장 번호"
                  className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                />
                <button
                  onClick={() => onSaveTracking?.(order.id, { carrier, trackingNo })}
                  className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                >
                  저장
                </button>
              </div>
              {(order.carrier || order.trackingNo) && (
                <p className="mt-2 text-xs text-gray-500">
                  현재 등록됨: {order.carrier || "-"} {order.trackingNo || "-"}
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-end">
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
