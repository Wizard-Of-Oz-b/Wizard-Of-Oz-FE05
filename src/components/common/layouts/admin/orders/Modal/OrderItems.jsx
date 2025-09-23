import React, { useMemo } from "react";
import { formatOptionsForDisplay, safeParseJSON } from "../../../../api/public/options";

function parseQueryString(qs) {
  if (typeof qs !== "string" || !qs.includes("=")) return null;
  try {
    return qs.split("&").reduce((acc, pair) => {
      const [k, v] = pair.split("=");
      if (!k) return acc;
      acc[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
      return acc;
    }, {});
  } catch {
    return null;
  }
}

function normalizeOptionToObject(raw) {
  if (!raw || raw === "-") return null;
  if (typeof raw === "object") {
    return Object.keys(raw).length ? raw : null;
  }
  if (typeof raw === "string") {
    // 1) JSON
    const asJson = safeParseJSON(raw);
    if (asJson && Object.keys(asJson).length) return asJson;
    // 2) 쿼리스트링 
    const asQS = parseQueryString(raw);
    if (asQS && Object.keys(asQS).length) return asQS;
    return raw;
  }
  return null;
}

function joinOptionValues(objOrStr) {
  if (!objOrStr) return "-";
  if (typeof objOrStr === "string") {
    const obj = parseQueryString(objOrStr);
    if (!obj) return objOrStr || "-";
    const vals = Object.values(obj).filter(Boolean);
    return vals.length ? vals.join(" / ") : "-";
  }
  if (typeof objOrStr === "object") {
    const vals = Object.values(objOrStr).filter(Boolean);
    return vals.length ? vals.join(" / ") : "-";
  }
  return "-";
}

export default function OrderItems({ order, fallbackOptionRaw }) {
  const { items, totalQty, totalAmount } = useMemo(() => {
    const src = Array.isArray(order?.items) ? order.items : [];

    const normalized = src.map((it) => {
      const nameRaw = it?.name ?? it?.product_name ?? "-";
      const name =
        typeof nameRaw === "string" ? nameRaw : nameRaw == null ? "-" : JSON.stringify(nameRaw);

      const rawKey = it?.option_key ?? it?.optionKey ?? null; // ← camel/snake 모두 지원
      const candidate1 = typeof rawKey === "string" && rawKey ? rawKey : null;
      const candidate2 =
        it?.options && typeof it.options === "object" && Object.keys(it.options).length
          ? it.options
          : it?.options ?? null;
      const candidate3 =
        it?.option && typeof it.option === "object" && Object.keys(it.option).length
          ? it.option
          : it?.option ?? null;

      let optionRaw = candidate1 ?? candidate2 ?? candidate3;

      if (
        (!optionRaw ||
          optionRaw === "-" ||
          (typeof optionRaw === "object" && Object.keys(optionRaw).length === 0)) &&
        fallbackOptionRaw
      ) {
        optionRaw = optionRaw || fallbackOptionRaw;
      }


      let optionsText = "-";
      if (typeof rawKey === "string" && rawKey) {
        const objFromKey = parseQueryString(rawKey);
        optionsText = formatOptionsForDisplay(objFromKey) || joinOptionValues(objFromKey || rawKey);
      } else {
        const normalizedOption = normalizeOptionToObject(optionRaw);
        optionsText =
          (typeof normalizedOption === "string"
            ? normalizedOption
            : formatOptionsForDisplay(normalizedOption)) || "-";
      }

      const qty = Number(it?.qty ?? it?.quantity ?? 0) || 0;
      const unit = Number(it?.price ?? it?.unit_price ?? 0) || 0;
      const lineTotal = unit * qty;

      const image_url = it?.image_url ?? it?.thumbnail_url ?? null;
      const item_id = it?.id ?? it?.item_id ?? null;
      const order_id = it?.order_id ?? order?.id ?? order?.purchase_id ?? null;
      const product_id = it?.product_id ?? null;
      const sku = it?.sku ?? null;
      const option_key = (it?.option_key ?? it?.optionKey) ?? null; 

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

    if (
      normalized.length === 0 &&
      (order?.product_name || (fallbackOptionRaw && fallbackOptionRaw !== "-"))
    ) {
      const headerOption = normalizeOptionToObject(fallbackOptionRaw);
      const optionsTextHeader =
        typeof headerOption === "string" ? headerOption : formatOptionsForDisplay(headerOption) || joinOptionValues(headerOption);

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
              <div className="h-20 w-15 rounded-lg border border-gray-200 bg-white shadow-sm grid place-items-center p-1.5">
                {it.image_url ? (
                  <img
                    src={it.image_url}
                    alt={String(it.name)}
                    onError={onThumbError}
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <span className="text-[10px] text-gray-400">NO IMAGE</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate font-medium">{String(it.name)}</div>
                <div className="text-xs text-gray-500">
                  옵션: {it.optionsText || "-"} · 수량 {it.qty}
                </div>
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
