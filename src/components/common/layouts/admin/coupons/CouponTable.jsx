import { Tag, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import IconButton from "../common/IconButton";
import Switch from "../common/Switch";
import { fmtMoney, getStatus } from "../../../../../utils/admin/couponUtils";

export default function CouponTable({ items, now, onEdit, onToggleActive, onDelete }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">코드</th>
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3 text-center">종류</th>
            <th className="px-4 py-3 text-right">값</th>
            <th className="px-4 py-3 text-right">최소주문</th>
            <th className="px-4 py-3 text-center">기간</th>
            <th className="px-4 py-3 text-center">사용</th>
            <th className="px-4 py-3 text-center">상태</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-10 text-center text-gray-500">쿠폰/프로모션이 없습니다.</td>
            </tr>
          ) : (
            items.map((c) => {
              const st = getStatus(now, c);
              return (
                <tr key={c.id} className="hover:bg-violet-50/30 transition-colors">
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    <button onClick={() => onEdit(c)} className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700">
                      {c.code}
                    </button>
                  </td>
                  <td className="px-4 py-4 truncate">{c.name}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                      <Tag className="size-3.5" />
                      {c.type === "percent" ? "퍼센트" : c.type === "fixed" ? "정액" : "무료배송"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold">
                    {c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? `${fmtMoney(c.value)}원` : "-"}
                  </td>
                  <td className="px-4 py-4 text-right">{c.minOrder ? `${fmtMoney(c.minOrder)}원` : "-"}</td>
                  <td className="px-4 py-4 text-center text-gray-700">
                    {c.startDate || "-"} ~ {c.endDate || "-"}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">
                    {c.usedCount ?? 0}{c.usageLimit ? ` / ${c.usageLimit}` : " / ∞"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <StatusBadge label={st} />
                      <Switch checked={c.active} onChange={() => onToggleActive(c.id)} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <IconButton title="수정" onClick={() => onEdit(c)}>
                        <Pencil className="size-4" /> 수정
                      </IconButton>
                      <button
                        onClick={() => onDelete(c)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700"
                      >
                        <Trash2 className="size-4" /> 삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
