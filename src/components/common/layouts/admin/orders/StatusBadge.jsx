export default function StatusBadge({ status, onClick }) {
  const base = "px-2.5 py-1 rounded-full text-xs font-semibold select-none inline-flex items-center";
    const ORDER_TONE = {
    주문접수: "bg-gray-100 text-gray-700",
    결제완료: "bg-indigo-100 text-indigo-700",
    상품준비: "bg-amber-100 text-amber-800",
    배송중:   "bg-blue-100 text-blue-700",
    배송완료: "bg-emerald-100 text-emerald-700",
    취소요청: "bg-rose-100 text-rose-700",
    취소완료: "bg-rose-200 text-rose-800",
    환불요청: "bg-purple-100 text-purple-700",
    환불완료: "bg-purple-200 text-purple-800",
  };

  const SHIPMENT_TONE = {
    접수:       "bg-gray-100 text-gray-700",
    이동중:     "bg-blue-100 text-blue-700",
    배송출발:   "bg-amber-100 text-amber-700",
    배송완료:   "bg-emerald-100 text-emerald-700",
    취소:       "bg-rose-100 text-rose-700",
    반송:       "bg-slate-200 text-slate-700",
  };

  const tone =
    ORDER_TONE[status] ??
    SHIPMENT_TONE[status] ??
    "bg-gray-100 text-gray-700";

  if (!onClick) return <span className={`${base} ${tone}`}>{status || "—"}</span>;

  return (
    <button
      onClick={onClick}
      className={`${base} ${tone} hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-violet-300`}
      title="상태 변경"
      type="button"
    >
      {status || "—"}
    </button>
  );
}
