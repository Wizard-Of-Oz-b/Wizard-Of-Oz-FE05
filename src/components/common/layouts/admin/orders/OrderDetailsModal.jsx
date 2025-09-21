import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import StatusSelect from "./StatusSelect";
import { Copy, Check, ClipboardList } from "lucide-react";

function CopyField({ label, value }) {
  const [copied, setCopied] = React.useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard?.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <code className="font-mono text-sm text-gray-800 break-all">{String(value ?? "-")}</code>
        <button
          type="button"
          onClick={doCopy}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
          aria-label="복사하기"
          title="복사하기"
        >
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4 text-gray-600" />}
        </button>
      </div>
    </div>
  );
}

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

  const normalizedItems = useMemo(() => {
    const items = Array.isArray(order?.items) ? order.items : [];
    return items.map((it) => {
      const nameRaw = it?.name ?? it?.product_name ?? "-";
      const name = typeof nameRaw === "string" ? nameRaw : nameRaw == null ? "-" : JSON.stringify(nameRaw);

      const optionRaw = it?.option ?? it?.options ?? "-";
      const option = typeof optionRaw === "string" ? optionRaw : optionRaw == null ? "-" : JSON.stringify(optionRaw);

      const qty = Number(it?.qty ?? it?.quantity ?? 0) || 0;
      const unit = Number(it?.price ?? it?.unit_price ?? 0) || 0;
      const lineTotal = unit * qty;

      const image_url = it?.image_url ?? it?.thumbnail_url ?? null;

      const item_id = it?.id ?? it?.item_id ?? null;
      const order_id = it?.order_id ?? order?.id ?? order?.purchase_id ?? null;
      const product_id = it?.product_id ?? null;
      const sku = it?.sku ?? null;
      const option_key = it?.option_key ?? null;

      return {
        id: item_id || `${name}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        option,
        qty,
        unit,
        lineTotal,
        image_url,
        meta: { item_id, order_id, product_id, sku, option_key },
      };
    });
  }, [order]);

  if (!order) return null;

  const headerPurchaseId = order.id ?? order.purchase_id ?? order.purchaseId ?? "-";
  const headerPg = order.pg ?? "-";
  const headerPgTid = order.pg_tid ?? "-";

  const totalQty = normalizedItems.reduce((a, b) => a + (b.qty || 0), 0);
  const totalAmount = normalizedItems.reduce((a, b) => a + (b.lineTotal || 0), 0);

  const onThumbError = (e) => {
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
           <rect width='100%' height='100%' fill='#f3f4f6'/>
           <path d='M12 55l16-16 10 10 18-18 12 12v20H12z' fill='#e5e7eb'/>
           <circle cx='32' cy='28' r='6' fill='#e5e7eb'/>
         </svg>`
      );
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-5xl">
      <div className="p-6 md:p-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* 왼쪽: 아이콘 + 타이틀 */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 shadow-sm">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">상세 주문 확인</h3>
              <p className="text-sm text-gray-500">Order Detail View</p>
            </div>
          </div>

          {/* 오른쪽: 상태 변경 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <StatusSelect value={order.status} onChange={(next) => onChangeStatus?.(order.id, next)} />
          </div>
        </div>

        {/* 상단 메타 카드 */}
        <div className="grid gap-2 mt-4">
          <CopyField label="구매/주문 ID" value={headerPurchaseId} />
        </div>

        {/* 바디 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 좌: 고객/배송 정보 */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 p-5 bg-white">
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
                    className="w-full min-h-[140px] rounded-xl bg-gray-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm resize-y"
                    placeholder="부재 시 문앞, 경비실 등"
                  />
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => onSaveContact?.(order.id, form)}
                    className="h-11 w-full rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
                  >
                    배송지/연락처 저장
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 우: 품목 + 운송장 */}
          <section className="lg:col-span-3 space-y-5">
            {/* 주문 품목 */}
            <div className="rounded-2xl border border-gray-100 p-5 bg-white">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold">주문 품목</h4>
                <div className="text-sm">
                  총 <span className="font-semibold text-gray-700">{totalQty}</span>개 · 합계{" "}
                  <span className="rounded-lg bg-violet-50 px-2 py-1 font-semibold text-violet-700">
                    {totalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>

              <ul className="divide-y divide-gray-100">
                {normalizedItems.map((it) => (
                  <li key={it.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {/* 썸네일 */}
                      <div className="h-16 w-16 rounded-lg border border-gray-200 bg-white shadow-sm grid place-items-center p-1.5">
                        {it.image_url ? (
                          <img
                            src={it.image_url}
                            alt={String(it.name)}
                            onError={onThumbError}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">NO IMAGE</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate font-medium">{String(it.name)}</div>
                        <div className="text-xs text-gray-500">옵션: {it.option} · 수량 {it.qty}</div>
                      </div>
                    </div>

                    <div className="shrink-0 text-sm font-semibold text-gray-800">
                      {Number(it.lineTotal).toLocaleString()}원
                    </div>
                  </li>
                ))}
                {normalizedItems.length === 0 && (
                  <li className="py-8 text-center text-sm text-gray-500">품목이 없습니다.</li>
                )}
              </ul>
            </div>

            {/* 운송장 정보 */}
            <div className="rounded-2xl border border-gray-100 p-5 bg-white">
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

        {/* 푸터 */}
        <div className="mt-8 flex items-center justify-end gap-2">
          {/* 필요 시 사용
          {order.request && (
            <button
              onClick={() => onOpenRequestModal?.()}
              className="h-10 rounded-xl bg-amber-100 px-4 text-sm font-semibold text-amber-800 hover:bg-amber-200"
            >
              {order.request.type === "cancel" ? "취소요청 처리" : "환불요청 처리"}
            </button>
          )}
          */}
          <button
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
