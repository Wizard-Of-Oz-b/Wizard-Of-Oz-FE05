import { ChevronRight } from "lucide-react";

export default function MenuItem({ icon: Icon, label, onClick, firstRef, danger = false }) {
  const base =
    "w-full px-4 py-3 text-left text-sm flex items-center justify-between rounded-lg focus:outline-none transition";
  const normal =
    "hover:bg-gray-50 focus:bg-gray-50 text-black";
  const dangerCls =
    "text-red-600 hover:bg-red-50 focus:bg-red-50";
  return (
    <button
      ref={firstRef}
      className={`${base} ${danger ? dangerCls : normal}`}
      onClick={onClick}
      role="menuitem"
    >
      <span className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${danger ? "text-red-600" : "text-black"}`} />
        {label}
      </span>
      {!danger && <ChevronRight className="w-4 h-4 text-gray-400" />}
    </button>
  );
}