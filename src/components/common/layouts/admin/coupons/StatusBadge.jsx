export default function StatusBadge({ label }) {
  const style =
    label === "진행중" ? "bg-emerald-100 text-emerald-700"
    : label === "예정"  ? "bg-amber-100 text-amber-700"
    : label === "만료"  ? "bg-gray-200 text-gray-700"
    :                     "bg-gray-100 text-gray-600"; // 비활성아이콘데쓰
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>{label}</span>;
}
