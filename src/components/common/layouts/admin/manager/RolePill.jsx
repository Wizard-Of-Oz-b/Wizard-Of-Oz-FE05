import { Crown, Shield, UsersRound } from "lucide-react";

export default function RolePill({ role }) {
  const color =
    role === "super"
      ? "bg-amber-100 text-amber-800 ring-amber-200"
      : role === "manager"
      ? "bg-violet-100 text-violet-800 ring-violet-200"
      : "bg-blue-100 text-blue-800 ring-blue-200";
  const Icon = role === "super" ? Crown : role === "manager" ? Shield : UsersRound;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {role}
    </span>
  );
}