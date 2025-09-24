import React, { useEffect, useState, useMemo } from "react";
import { getShipment, normalizeShipmentStatus, registerShipment, SHIPMENT_STATUS_LABEL, syncShipment } from "../../../../api/common/shipments";
import dayjs from "dayjs";

const fmt = (ts) =>
  ts ? dayjs(ts).format("YYYY-MM-DD HH:mm") : "—";

export default function TrackingCard({ order, onSaveTracking }) {
  const [carrier, setCarrier] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [loading, setLoading] = useState(false);

  const [shipment, setShipment] = useState(null);
  const shipmentId = useMemo(() => {
    if (order?.shipmentId) return order.shipmentId;
    try {
      const map = JSON.parse(localStorage.getItem("shipmentByPurchase") || "{}");
      return map?.[order?.id]?.shipmentId || null;
    } catch {
      return null;
    }
  }, [order?.id, order?.shipmentId]);

  const handleSyncNow = async () => {
    if (!shipmentId && !trackingNo) return;
    try {
      setLoading(true);
      await syncShipment({
        tracking_number: trackingNo || shipment?.tracking_number,
        carrier: carrier || shipment?.carrier,
        carrier_code: carrier || shipment?.carrier,
      });
      await refresh();
    } catch (e) {
      console.error("sync failed", e);
      onSaveTracking?.(order.id, { __error: true, message: "동기화에 실패했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order) return;
    setCarrier(order.carrier || "");
    setTrackingNo(order.trackingNo || "");
  }, [order]);

  useEffect(() => {
    if (!shipmentId) {
      setShipment(null);
      return;
    }

    let alive = true;
    const fetchOne = async () => {
      try {
        const s = await getShipment(shipmentId);
        if (!alive) return;
        setShipment(s);
        onSaveTracking?.(order.id, {
          carrier: s.carrier,
          trackingNo: s.tracking_number,
          shipmentId: s.id,
          status: s.status,
          last_synced_at: s.last_synced_at,
          __silent: true,
        });
        // localStorage 동기화
        try {
          const map = JSON.parse(localStorage.getItem("shipmentByPurchase") || "{}");
          map[String(order.id)] = {
            shipmentId: s.id,
            carrier: s.carrier,
            trackingNo: s.tracking_number,
            status: s.status,
            last_synced_at: s.last_synced_at,
          };
          localStorage.setItem("shipmentByPurchase", JSON.stringify(map));
        } catch {}
      } catch (e) {
        console.warn("getShipment failed", e);
      }
    };

    fetchOne(); 
    const itv = setInterval(fetchOne, 60_000);
    return () => {
      alive = false;
      clearInterval(itv);
    };
  }, [shipmentId, order?.id, onSaveTracking]);

  const refresh = async () => {
    if (!shipmentId) return;
    try {
      const s = await getShipment(shipmentId);
      setShipment(s);
      onSaveTracking?.(order.id, {
        carrier: s.carrier,
        trackingNo: s.tracking_number,
        shipmentId: s.id,
        status: s.status,
        last_synced_at: s.last_synced_at,
        __silent: true,
      });
    } catch (e) {
      console.warn(e);
    }
  };

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

    const sKey = normalizeShipmentStatus(shipment?.status);
    const label =
    SHIPMENT_STATUS_LABEL[sKey] ||
    (sKey ? sKey : (shipmentId || trackingNo ? "접수" : "—"));

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

      {shipmentId && (
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">현재 배송 상태: <span className="inline-block rounded-full bg-white px-2 py-0.5 text-xs border">{label}</span></div>
            <button
              onClick={refresh}
              className="text-xs rounded-lg border px-2 py-1 bg-white hover:bg-violet-50"
              title="새로고침"
              type="button"
            >
              새로고침
            </button>
          </div>

          <div className="text-sm text-gray-800">
            {shipment?.last_event_status || "최근 이벤트 없음"}
          </div>
          <div className="text-xs text-gray-500">
            {[shipment?.last_event_loc, shipment?.last_event_desc].filter(Boolean).join(" · ") || "—"}
          </div>
          <div className="mt-1 text-[11px] text-gray-400 space-x-2">
            {shipment?.last_event_at && <span>이벤트: {fmt(shipment.last_event_at)}</span>}
            {shipment?.last_synced_at && <span>동기화: {fmt(shipment.last_synced_at)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
