import CopyField from "./CopyField";

export default function MetaCard({ order }) {
  const headerPurchaseId = order.id ?? order.purchase_id ?? order.purchaseId ?? "-";
  return (
    <div className="grid gap-2 mt-4">
      <CopyField label="구매/주문 ID" value={headerPurchaseId} />
    </div>
  );
}
