import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import IconButton from "../common/IconButton";

export default function Pagination({
  page,
  pageCount,
  onChange,
  className = "",
  showStatus = true,
  size = "md", // md | sm
}) {
  const disabledPrev = page <= 1;
  const disabledNext = page >= pageCount;

  const btnCls =
    size === "sm"
      ? "h-8 w-8 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
      : "h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed";

  const Status = () =>
    showStatus ? (
      <span className={`px-2 text-sm font-medium tabular-nums select-none ${size==="sm"?"text-xs":""}`}>
        <span className="font-semibold text-violet-700">페이지 {page}</span> / {pageCount}
      </span>
    ) : null;

  return (
    <nav className={`flex justify-center items-center gap-2 ${className}`} aria-label="Pagination">
      <IconButton title="첫 페이지" onClick={() => onChange(1)} disabled={disabledPrev} className={btnCls}>
        <ChevronsLeft className="size-4" />
      </IconButton>
      <IconButton title="이전" onClick={() => onChange(page - 1)} disabled={disabledPrev} className={btnCls}>
        <ChevronLeft className="size-4" />
      </IconButton>

      <Status />

      <IconButton title="다음" onClick={() => onChange(page + 1)} disabled={disabledNext} className={btnCls}>
        <ChevronRight className="size-4" />
      </IconButton>
      <IconButton title="마지막" onClick={() => onChange(pageCount)} disabled={disabledNext} className={btnCls}>
        <ChevronsRight className="size-4" />
      </IconButton>
    </nav>
  );
}
