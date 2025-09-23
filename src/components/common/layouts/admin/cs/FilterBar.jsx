import React, { useMemo } from "react";
import { Search, Calendar } from "lucide-react";

export default function FilterBar({
  q, onChangeQ,
  statusFilter, onChangeStatus,
  priorityFilter, onChangePriority,
  startDate, onChangeStart,
  endDate, onChangeEnd,

  onQuickToday,
  onQuickReset,

  statusOptions = ["열림", "대기", "답변완료", "종료"],
  priorityOptions = ["낮음", "보통", "높음"],
  searchPlaceholder = "코드/제목/고객명/이메일 검색…",
}) {

    const todayYMD = useMemo(() => {
    const d = new Date();
    const p2 = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
  }, []);

  const handleToday = () => {
    if (onQuickToday) return onQuickToday();
    // fallback: 내부에서 설정
    onChangeStart?.(todayYMD);
    onChangeEnd?.(todayYMD);
  };

  const handleReset = () => {
    if (onQuickReset) return onQuickReset();
    // fallback: 내부에서 초기화
    onChangeStart?.("");
    onChangeEnd?.("");
  };

  return (
    <div className="mb-6 rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
      <div className="grid items-center gap-3 md:grid-cols-[minmax(300px,1fr),160px,160px,minmax(360px,1fr)]">
        {/* 검색 */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            value={q}
            onChange={(e) => onChangeQ?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            aria-label="검색어 입력"
          />
        </div>

        {/* 상태 */}
        <select
          value={statusFilter}
          onChange={(e) => onChangeStatus?.(e.target.value)}
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          aria-label="상태 필터"
        >
          <option value="">상태: 전체</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* 우선순위 */}
        <select
          value={priorityFilter}
          onChange={(e) => onChangePriority?.(e.target.value)}
          className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          aria-label="우선순위 필터"
        >
          <option value="">우선순위: 전체</option>
          {priorityOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* 기간 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onChangeStart?.(e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 pl-9 pr-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              aria-label="시작일"
            />
          </div>
          <span className="px-1 text-gray-400">~</span>
          <div className="relative flex-1 min-w-[160px]">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => onChangeEnd?.(e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 pl-9 pr-2 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              aria-label="종료일"
            />
          </div>

          <button onClick={handleToday} className="h-9 rounded-lg px-2 text-xs text-gray-600 hover:bg-gray-100">
            오늘
          </button>
          <button onClick={handleReset} className="h-9 rounded-lg px-2 text-xs text-gray-600 hover:bg-gray-100">
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
