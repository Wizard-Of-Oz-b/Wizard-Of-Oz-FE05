export default function PriorityBadge({ level }) {
  const map = {
    낮음: "bg-gray-100 text-gray-700",
    보통: "bg-indigo-100 text-indigo-700",
    높음: "bg-rose-100 text-rose-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${map[level]}`}>{level}</span>;
}
