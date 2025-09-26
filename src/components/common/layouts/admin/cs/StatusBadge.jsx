export default function StatusBadge({ status, onClick }) {
  const map = {
    열림: "bg-sky-100 text-sky-700",
    대기: "bg-amber-100 text-amber-700",
    답변완료: "bg-emerald-100 text-emerald-700",
    종료: "bg-gray-200 text-gray-700",
  };
  return (
    <span
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-700"} ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      }`}
    >
      {status}
    </span>
  );
}
