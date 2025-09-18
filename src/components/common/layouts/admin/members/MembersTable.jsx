import RoleBadge from "./RoleBadge";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const fmtCreated = (ts) => (ts ? dayjs.utc(ts).tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH시 mm분") : "—");

export default function MembersTable({ rows = [], loading = false, pageSize = 10, onOpenDetail, onOpenRole }) {
  const fillerCount = loading ? Math.max(0, pageSize - rows.length) : 0;
  const showRows = rows;
  const fillers = Array.from({ length: fillerCount });

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      {loading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-sm"
          aria-hidden
        >
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
            검색 중…
          </div>
        </div>
      )}

      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">이름</th>
            <th className="px-4 py-3">이메일</th>
            <th className="px-4 py-3">연락처</th>
            <th className="px-4 py-3 text-center">등급</th>
            <th className="px-4 py-3 text-center">가입일자</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm align-middle">
          {showRows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-500">회원이 없습니다.</td>
            </tr>
          ) : (
            <>
              {showRows.map((m) => (
                <tr key={m.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    <span className="truncate">{m.name || m.nickname || m.username || (m.email ? m.email.split("@")[0] : "(이름 없음)")}</span>
                  </td>
                  <td className="px-4 py-4">{m.email}</td>
                  <td className="px-4 py-4">{m.phone || m.phone_number || "—"}</td>
                  <td className="px-4 py-4 text-center">
                    <RoleBadge role={m.role} />
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">{fmtCreated(m.created_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onOpenDetail?.(m.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50"
                      >
                        상세보기
                      </button>
                      <button
                        onClick={() => onOpenRole?.(m.id)}
                        className="rounded-lg bg-violet-600 text-white px-3 py-1.5 text-xs hover:bg-violet-500"
                      >
                        권한 변경
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {fillers.map((_, i) => (
                <tr key={`filler-${i}`} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-56 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto h-6 w-20 rounded-full bg-slate-100" />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="mx-auto h-4 w-40 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="mx-auto h-8 w-32 rounded bg-slate-100" />
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
