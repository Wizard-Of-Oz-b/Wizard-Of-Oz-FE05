import { ClipboardList } from "lucide-react";
import { normalizeShipmentStatus, SHIPMENT_STATUS_LABEL } from "../../../../api/common/shipments";
import StatusBadge from "../StatusBadge";

export default function HeaderBar({ order , onChangeStatus }) {
  const sKey = normalizeShipmentStatus(order?.shipment?.status);
  const keyOrPending = sKey || (order?.shipmentId || order?.shipment?.tracking_number ? "pending" : "");
  const shipLabel = SHIPMENT_STATUS_LABEL[keyOrPending] || (keyOrPending ? keyOrPending : "—");

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 shadow-sm">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">상세 주문 확인</h3>
          <p className="text-sm text-gray-500">Order Detail View</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
        <StatusBadge status={shipLabel} />
      </div>
    </div>
  );
}
