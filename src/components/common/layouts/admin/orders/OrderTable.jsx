import { StatusBadge } from ".";
import { normalizeShipmentStatus, SHIPMENT_STATUS_LABEL } from "../../../api/common/shipments";

const TERMINALS = new Set(["취소완료", "환불완료"]);

function calcTotalKRW(o) {
  if (Array.isArray(o?.items) && o.items.length > 0) {
    const sum = o.items.reduce((acc, it) => {
      const unit = Number(it?.price ?? it?.unit_price ?? 0) || 0;
      const qty = Number(it?.qty ?? it?.quantity ?? 0) || 0;
      return acc + unit * qty;
    }, 0);
    if (!Number.isNaN(sum) && sum > 0) return sum;
  }

  if (o?.totalAmount != null) {
    const tot = Number(o.totalAmount);
    if (!Number.isNaN(tot) && tot >= 0) return tot;
  }

  const unit = Number(o?.unit_price ?? o?.price ?? 0) || 0;
  const qty = Number(o?.amount ?? o?.qty ?? 1) || 1;
  return unit * qty;
}

/** 대표 상품명 */
function getPrimaryName(o) {
  if (o?.items?.[0]?.name) return String(o.items[0].name);
  if (o?.product_name) return String(o.product_name);
  return "-";
}

/** 주문일 */
function fmtDate(value) {
  if (!value) return "-";
  const v =
    typeof value === "string" || typeof value === "number"
      ? value
      : String(value);
  try {
    return new Date(v).toLocaleString();
  } catch {
    return "-";
  }
}

export default function OrderTable({ orders = [], onOpenDetails, onOpenRequest, onOpenStatus }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">주문번호</th>
            <th className="px-4 py-3">고객명</th>
            <th className="px-4 py-3">대표 상품</th>
            <th className="px-4 py-3 text-right">금액</th>
            <th className="px-4 py-3 text-center">상태</th>
            <th className="px-4 py-3 text-center">요청</th>
            <th className="px-4 py-3 text-center">주문일</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-500">주문이 없습니다.</td>
            </tr>
          ) : (
            orders.map((o) => {
              const totalKRW = calcTotalKRW(o);
              const primaryName = getPrimaryName(o);
              const extraCount =
                Array.isArray(o.items) && o.items.length > 1
                  ? o.items.length - 1
                  : 0;

              return (
                <tr key={o.id ?? o.purchase_id ?? o.orderNo} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    <button
                      onClick={() => onOpenDetails?.(o.id ?? o.purchase_id)}
                      className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700"
                    >
                      {o.orderNo ?? (o.pg_tid || String(o.id ?? o.purchase_id ?? "-").split("-")[0])}
                    </button>
                  </td>

                  <td className="px-4 py-4">{o.customer ? String(o.customer) : "-"}</td>

                  <td className="px-4 py-4 truncate">
                    {primaryName}
                    {extraCount > 0 && (
                      <span className="text-xs text-gray-500"> 외 {extraCount}건</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-violet-700">
                    {Number(totalKRW || 0).toLocaleString()}원
                  </td>

                  <td className="px-4 py-4 text-center">
                    {(() => {
                      let sKey = normalizeShipmentStatus(o?.shipment?.status);
                      if (!sKey && (o?.shipmentId || o?.trackingNo || o?.shipment?.tracking_number)) {
                      sKey = '-';
                      }
                      const label = SHIPMENT_STATUS_LABEL[sKey] || (sKey ? sKey : '—');
                      return <StatusBadge status={label} />;
                    })()}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {o.request ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {o.request.type === "cancel" ? "취소요청" : "환불요청"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center text-gray-600">
                    {fmtDate(o.created_at)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {o.request && !TERMINALS.has(o.status) ? (
                      <button
                        onClick={() => onOpenRequest?.(o.id ?? o.purchase_id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-200"
                      >
                        {o.request.type === "cancel" ? "취소요청 처리" : "환불요청 처리"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}