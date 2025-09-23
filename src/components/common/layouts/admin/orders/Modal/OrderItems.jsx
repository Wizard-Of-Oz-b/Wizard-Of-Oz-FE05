import React, { useMemo } from "react";
import { formatOptionsForDisplay, safeParseJSON } from "../../../../api/public/options";

export default function OrderItems({ order, fallbackOptionRaw }) {
  const { items, totalQty, totalAmount } = useMemo(() => {
    const src = Array.isArray(order?.items) ? order.items : [];

    const normalized = src.map((it) => {
      const nameRaw = it?.name ?? it?.product_name ?? "-";
      const name = typeof nameRaw === "string" ? nameRaw : nameRaw == null ? "-" : JSON.stringify(nameRaw);

      let optionRaw = it?.option ?? it?.options ?? it?.option_key;
      const isEmptyObj = optionRaw && typeof optionRaw === "object" && Object.keys(optionRaw).length === 0;
      const isEmptyStr = !optionRaw || optionRaw === "-";
      if (isEmptyStr || isEmptyObj) optionRaw = fallbackOptionRaw;

      const optionsObj = safeParseJSON(optionRaw);
      const optionsText = formatOptionsForDisplay(optionsObj);

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
        optionsText,
        qty,
        lineTotal,
        image_url,
        meta: { item_id, order_id, product_id, sku, option_key },
      };
    });

    if (normalized.length === 0 && (order?.product_name || fallbackOptionRaw !== "-")) {
      const optionsObjHeader = safeParseJSON(fallbackOptionRaw);
      const optionsTextHeader = formatOptionsForDisplay(optionsObjHeader);
      const qty = Number(order?.amount ?? 1) || 1;
      const unit = Number(order?.unit_price ?? 0) || 0;

      normalized.push({
        id: order?.purchase_id ?? order?.id ?? "purchase-single",
        name: order?.product_name ?? "-",
        optionsText: optionsTextHeader,
        qty,
        lineTotal: unit * qty,
        image_url: order?.thumbnail_url ?? null,
        meta: {
          item_id: null,
          order_id: order?.purchase_id ?? null,
          product_id: order?.product ?? null,
          sku: order?.sku ?? null,
          option_key: order?.option_key ?? null,
        },
      });
    }

    const totalQty = normalized.reduce((a, b) => a + (b.qty || 0), 0);
    const totalAmount = normalized.reduce((a, b) => a + (b.lineTotal || 0), 0);

    return { items: normalized, totalQty, totalAmount };
  }, [order, fallbackOptionRaw]);

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
    <div className="rounded-2xl border border-gray-100 p-5 bg-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold">주문 품목</h4>
        <div className="text-sm">
          총 <span className="font-semibold text-gray-700">{totalQty}</span>개 · 합계{" "}
          <span className="rounded-lg bg-violet-50 px-2 py-1 font-semibold text-violet-700">
            {Number(totalAmount).toLocaleString()}원
          </span>
        </div>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((it) => (
          <li key={it.id} className="py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
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
                <div className="text-xs text-gray-500">옵션: {it.optionsText || "-"} · 수량 {it.qty}</div>
              </div>
            </div>

            <div className="shrink-0 text-sm font-semibold text-gray-800">
              {Number(it.lineTotal).toLocaleString()}원
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-8 text-center text-sm text-gray-500">품목이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
