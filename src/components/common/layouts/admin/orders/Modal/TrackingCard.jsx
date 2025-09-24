import React, { useEffect, useState } from "react";
import { registerShipment } from "../../../../api/common/shipments";

export default function TrackingCard({ order, onSaveTracking }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) return;
    setCarrier(order.carrier || "");
    setTrackingNo(order.trackingNo || "");
  }, [order]);

  const handleSave = async () => {
    if (!order?.id || !trackingNo) return;
    try {
      setLoading(true);
      const res = await registerShipment({
        purchase_id: order.id,
        tracking_number: trackingNo,
        carrier,
        carrier_code: carrier,
      });
      onSaveTracking?.(order.id, {
        carrier: res.carrier ?? carrier,
        trackingNo: res.tracking_number ?? trackingNo,
        shipmentId: res.id,
        status: res.status,
        last_synced_at: res.last_synced_at,
      });
      try {
        const map = JSON.parse(localStorage.getItem('shipmentByPurchase') || '{}');
        map[order.id] = { shipmentId: res.id, carrier: res.carrier ?? carrier, trackingNo: res.tracking_number ?? trackingNo };
        localStorage.setItem('shipmentByPurchase', JSON.stringify(map));
      } catch {}
      setCarrier(res.carrier ?? carrier);
      setTrackingNo(res.tracking_number ?? trackingNo);
    } catch (err) {
      console.error("운송장 등록 실패:", err);
      onSaveTracking?.(order.id, { __error: true, message: "운송장 등록에 실패했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setLoading(false);
    }
  };

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
          onClick={handleSave}
          className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          저장
        </button>
      </div>
      {(order.carrier || order.trackingNo) && (
        <p className="mt-2 text-xs text-gray-500">
          현재 등록된 송장 정보: {order.carrier || "-"} {order.trackingNo || "-"}
        </p>
      )}
    </div>
  );
}
