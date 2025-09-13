export default function RoleBadge({ role, onClick }) {
  const map = {
    superadmin: "슈퍼관리자",
    page_admin: "페이지관리자",
    cs_admin: "CS관리자",
    customer: "일반고객",
  };
  const cls =
    role === "superadmin"
      ? "bg-purple-100 text-purple-700"
      : role === "page_admin"
      ? "bg-blue-100 text-blue-700"
      : role === "cs_admin"
      ? "bg-amber-100 text-amber-800"
      : "bg-gray-100 text-gray-700";
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${onClick ? "cursor-pointer hover:ring-2 hover:ring-violet-300" : ""} ${cls}`}
    >
      {map[role] || role}
    </span>
  );
}