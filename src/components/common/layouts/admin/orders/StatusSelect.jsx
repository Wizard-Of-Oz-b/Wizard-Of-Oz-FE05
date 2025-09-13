import StatusBadge from "./StatusBadge";
import { NEXT_ALLOWED } from "../../../../features/admin/orders/constants";

export default function StatusSelect({ value, onChange }) {
  const options = NEXT_ALLOWED[value] || [];
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={value} />
    </div>
  );
}
