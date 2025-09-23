import React, { useEffect, useState } from "react";

export default function TrackingCard({ order, onSaveTracking }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");

  useEffect(() => {
    if (!order) return;
    setCarrier(order.carrier || "");
    setTrackingNo(order.trackingNo || "");
  }, [order]);

  return (
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
  );
}
