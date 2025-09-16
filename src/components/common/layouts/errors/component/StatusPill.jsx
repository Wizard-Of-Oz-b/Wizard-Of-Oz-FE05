import { pickIcon } from "./pickIcon";

const colorMap = {
  401: "bg-amber-50 text-amber-700",
  403: "bg-red-50 text-red-700",
  404: "bg-gray-100 text-gray-600",
  429: "bg-pink-50 text-pink-700",
  500: "bg-rose-50 text-rose-700",
  503: "bg-indigo-50 text-indigo-700",
  default: "bg-violet-50 text-violet-700",
};

export default function StatusPill({ status, label = "오류" }) {
  const Icon = pickIcon(status);
  const cls = colorMap[status] || colorMap.default;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      <Icon className="size-4" />
      <span>
        {status}
      </span>
    </span>
  );
}
