import dayjs from "dayjs";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SHIPMENT_STATUS_LABEL } from "../../../api/common/shipments";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const fmt = (ts) =>
  ts ? dayjs.utc(ts).tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH시 mm분") : "—";

export default function ShipmentsTable({
  rows = [],
  loading = false,
  pageSize = 20,
}) {
  const showRows = rows || [];
  const fillerCount = loading ? Math.max(0, pageSize - showRows.length) : 0;
  const fillers = Array.from({ length: fillerCount });

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      {/* 로딩 */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/65 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-top-color-transparent" />
            불러오는 중…
          </div>
        </div>
      )}

      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">운송장번호</th>
            <th className="px-4 py-3">택배사</th>
            <th className="px-4 py-3">현재 상태</th>
            <th className="px-4 py-3">최근 이벤트</th>
            <th className="px-4 py-3">최근 업데이트</th>
            <th className="px-4 py-3">출고일</th>
            <th className="px-4 py-3 rounded-tr-2xl">배송완료</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm align-middle">
          {showRows.length === 0 && !loading ? (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-500">
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            <>
              {showRows.map((r) => (
                <tr key={r.id} className="hover:bg-violet-50/40 transition-colors">
                  <td className="px-4 py-4 font-mono">
                    {r.tracking_number || "—"}
                  </td>
                  <td className="px-4 py-4">{r.carrier || "—"}</td>
                  <td className="px-4 py-4">
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                      {SHIPMENT_STATUS_LABEL?.[r.status] || r.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    <div className="font-medium">
                      {r.last_event_status || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {[r.last_event_loc, r.last_event_desc]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-4">{fmt(r.last_synced_at)}</td>
                  <td className="px-4 py-4">{fmt(r.shipped_at)}</td>
                  <td className="px-4 py-4">{fmt(r.delivered_at)}</td>
                </tr>
              ))}

              {/* 스켈레톤 */}
              {fillers.map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-4 w-40 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-20 rounded-full bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-64 rounded bg-slate-100 mb-1.5" />
                    <div className="h-3 w-48 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-44 rounded bg-slate-100" />
                  </td>
                    <td className="px-4 py-4">
                    <div className="h-4 w-36 rounded bg-slate-100" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-36 rounded bg-slate-100" />
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
