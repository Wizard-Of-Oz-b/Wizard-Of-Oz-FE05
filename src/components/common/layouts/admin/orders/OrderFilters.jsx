import { Search, Calendar } from "lucide-react";
import { ORDER_STATUS } from "../../../../features/admin/orders/constants";

export default function OrderFilters({
  q,
  setQ,
  statusFilter,
  setStatusFilter,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setToday,
  setThisWeek,
  setThisMonth,
  clearRange,
}) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-start rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
      {/* 검색 */}
      <div className="relative md:col-span-2">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="코드/이름 검색…"
          className="h-10 w-[500px] rounded-xl bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
        />
      </div>

      {/* 상태 */}
      <div>
        <div className="text-xs text-gray-500 mb-1.5">상태</div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
        >
          <option value="">전체</option>
          {ORDER_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 기간 */}
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs text-gray-500 inline-flex items-center gap-1">
            <Calendar className="size-4" /> 기간
          </div>
          <div className="flex gap-1">
            <button
              onClick={setToday}
              className="rounded-lg bg-gray-100 text-xs px-2 py-1 hover:bg-gray-200"
              type="button"
            >
              오늘
            </button>
            <button
              onClick={setThisWeek}
              className="rounded-lg bg-gray-100 text-xs px-2 py-1 hover:bg-gray-200"
              type="button"
            >
              이번주
            </button>
            <button
              onClick={setThisMonth}
              className="rounded-lg bg-gray-100 text-xs px-2 py-1 hover:bg-gray-200"
              type="button"
            >
              이번달
            </button>
            <button
              onClick={clearRange}
              className="rounded-lg bg-gray-100 text-xs px-2 py-1 hover:bg-gray-200"
              type="button"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex items-center rounded-xl bg-gray-50 ring-1 ring-gray-200 px-2">
          <div className="relative flex-1">
            <Calendar className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full bg-transparent pl-8 pr-2 text-sm outline-none"
              placeholder="시작일자"
            />
          </div>
          <span className="px-2 text-gray-400">~</span>
          <div className="relative flex-1">
            <Calendar className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full bg-transparent pl-8 pr-2 text-sm outline-none"
              placeholder="종료일자"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
