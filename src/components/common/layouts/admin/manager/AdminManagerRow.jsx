import { Edit3, Trash2 } from "lucide-react";
import RolePill from "./RolePill";
import UserCell from "./UserCell";

export default function AdminManagerRow({ item, onEdit, onRevoke }) {
  return (
    <tr className="border-b border-black/5 hover:bg-slate-50/40">
      <td className="px-5 py-3 font-medium text-slate-800">{item.admin_id}</td>
      <td className="px-5 py-3">
        <UserCell item={item} />
      </td>
      <td className="px-5 py-3">
        <RolePill role={item.role} />
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50"
            title="권한 변경"
          >
            <Edit3 className="w-4 h-4" />
            변경
          </button>
          <button
            onClick={() => onRevoke?.(item)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-rose-50 text-rose-600"
            title="관리자 해제"
          >
            <Trash2 className="w-4 h-4" />
            해제
          </button>
        </div>
      </td>
    </tr>
  );
}