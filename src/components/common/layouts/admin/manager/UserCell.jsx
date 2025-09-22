import { Mail, UserRound } from "lucide-react";

export default function UserCell({ item }) {
  const name = item?.user_name || item?.user?.name || null;
  const email = item?.user_email || item?.user?.email || null;

  if (!name && !email) {
    return (
      <div className="flex items-center gap-2">
        <UserRound className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-800">User #{item.user_id}</span>
        <span className="text-[11px] text-slate-400">(이름/이메일 미제공)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <UserRound className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-800">{name || `User #${item.user_id}`}</span>
      </div>
      {email && (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 ring-1 ring-slate-200">
          <Mail className="w-3.5 h-3.5" />
          {email}
        </span>
      )}
    </div>
  );
}