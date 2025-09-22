import { Reply } from "lucide-react";
import { StatusBadge, PriorityBadge, IconButton } from ".";

export default function CustomerSupportTable({ pageData, onOpenDetail }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">티켓번호</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3">고객</th>
            <th className="px-4 py-3 text-center">상태</th>
            <th className="px-4 py-3 text-center">우선</th>
            <th className="px-4 py-3">담당자</th>
            <th className="px-4 py-3 text-center">생성일</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-500">
                문의가 없습니다.
              </td>
            </tr>
          ) : (
            pageData.map((t) => (
              <tr key={t.id} className="hover:bg-violet-50/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-gray-800">
                  <button
                    className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700"
                    onClick={() => onOpenDetail(t)}
                  >
                    {t.code}
                  </button>
                </td>
                <td className="px-4 py-4 truncate">{t.subject}</td>
                <td className="px-4 py-4">
                  {t.customer.name}{" "}
                  <span className="text-xs text-gray-500">({t.customer.email})</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-4 text-center">
                  <PriorityBadge level={t.priority} />
                </td>
                <td className="px-4 py-4">{t.assignee}</td>
                <td className="px-4 py-4 text-center text-gray-600">
                  {t.created_at}
                </td>
                <td className="px-4 py-4 text-center">
                  <IconButton title="상세" onClick={() => onOpenDetail(t)}>
                    <Reply className="size-4" /> 답변
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
