import React from "react";
import { ChevronRight, X, Grid2X2, Rows2 } from "lucide-react";

const PrimaryLabel = ({ keyName }) => <>{String(keyName || "")}</>;

export default function CategoryResultsHeader({
  primary,          // "MEN" | "WOMEN" ...
  item,             // "아우터" 등
  categoryId,       // uuid
  total = 0,        // 총 개수
  keyword = "",     // q
  view = "grid",    // "grid" | "list"
  onRemoveChip,     // (type) => void // "primary" | "item" | "q"
  onToggleView,     // (next) => void
  sortValue,
  onChangeSort,
}) {
  const crumbs = [primary ? <PrimaryLabel keyName={primary} /> : null, item || null].filter(Boolean);
  const sortOptions = [
    { label: "최신순", value: "-created_at" },
    { label: "낮은 가격순", value: "price" },
    { label: "높은 가격순", value: "-price" },
    { label: "이름순(A→Z)", value: "name" },
  ];

  return (
    <div className="w-full max-w-6xl px-4 mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
        {crumbs.length ? (
          crumbs.map((c, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <ChevronRight className="mx-2 h-4 w-4 opacity-60" aria-hidden />}
              <span
                className={
                  i === crumbs.length - 1
                    ? "rounded-md bg-gray-50 px-2 py-0.5 text-gray-900 ring-1 ring-gray-200"
                    : "hover:text-gray-700 transition-colors"
                }
              >
                {c}
              </span>
            </span>
          ))
        ) : (
          <span className="text-gray-400">전체</span>
        )}
      </nav>

      {/* Title + meta */}
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            {item || primary || "전체 상품"}
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            {`결과: ${Number(total).toLocaleString()}개`}
            {categoryId ? (
              <span className="ml-2 rounded bg-gray-100 text-gray-600 px-2 py-0.5 text-[11px]">카테고리ID: {String(categoryId).slice(0, 8)}…</span>
            ) : null}
          </p>
        </div>

        {/* View toggle + sort */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleView?.(view === "grid" ? "list" : "grid")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            title={view === "grid" ? "리스트 보기" : "그리드 보기"}
            aria-label={view === "grid" ? "리스트 보기" : "그리드 보기"}
            type="button"
          >
            {view === "grid" ? (
              <>
                <Rows2 className="h-4 w-4" />
                리스트
              </>
            ) : (
              <>
                <Grid2X2 className="h-4 w-4" />
                그리드
              </>
            )}
          </button>

          <div className="relative">
            <select
              value={sortValue}
              onChange={(e) => onChangeSort?.(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="정렬 순서"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {/* caret */}
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {primary && <Chip label={`대상: ${primary}`} onRemove={() => onRemoveChip?.("primary")} />}
        {item && <Chip label={`분류: ${item}`} onRemove={() => onRemoveChip?.("item")} />}
        {keyword && <Chip label={`키워드: ${keyword}`} onRemove={() => onRemoveChip?.("q")} />}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="group inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
      <span className="truncate max-w-[14rem]" title={label}>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 rounded p-0.5 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          title="필터 제거"
          aria-label="필터 제거"
          type="button"
        >
          <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
        </button>
      )}
    </span>
  );
}
