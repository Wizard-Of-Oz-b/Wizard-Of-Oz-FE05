import RoleBadge from "./RoleBadge";

export default function MembersTable({ rows, onOpenDetail }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">이름</th>
            <th className="px-4 py-3">이메일(아이디)</th>
            <th className="px-4 py-3">연락처</th>
            <th className="px-4 py-3 text-center">등급</th>
            <th className="px-4 py-3 text-center">가입일</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-500">
                회원이 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((m) => (
              <tr key={m.id} className="hover:bg-violet-50/40 transition-colors">
                <td className="px-4 py-4 font-semibold text-gray-800">
                  <button onClick={() => onOpenDetail(m.id)} className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700">
                    {m.name}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => onOpenDetail(m.id)} className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700">
                    {m.email}
                  </button>
                </td>
                <td className="px-4 py-4">{m.phone}</td>
                <td className="px-4 py-4 text-center">
                  <RoleBadge role={m.role} />
                </td>
                <td className="px-4 py-4 text-center text-gray-600">{m.created_at}</td>
                <td className="px-4 py-4 text-center">
                  <span className="text-xs text-gray-400">—</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}