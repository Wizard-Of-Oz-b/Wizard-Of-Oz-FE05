import IconButton from "../common/IconButton";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export default function Pagination({ page, pageCount, goFirst, goPrev, goNext, goLast }) {
  const iconBtnCls =
    "h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed";

  return (
    <nav className="mt-6 flex items-center justify-center gap-2" aria-label="페이지네이션">
      <IconButton
        title="첫 페이지"
        aria-label="첫 페이지"
        onClick={goFirst}
        disabled={page <= 1}
        className={iconBtnCls}
      >
        <ChevronsLeft className="size-4" />
      </IconButton>
      <IconButton
        title="이전"
        aria-label="이전 페이지"
        onClick={goPrev}
        disabled={page <= 1}
        className={iconBtnCls}
      >
        <ChevronLeft className="size-4" />
      </IconButton>

      <span className="px-2 text-sm font-medium tabular-nums select-none">
        <span className="font-semibold text-violet-700">페이지 {page}</span> / {pageCount}
      </span>

      <IconButton
        title="다음"
        aria-label="다음 페이지"
        onClick={goNext}
        disabled={page >= pageCount}
        className={iconBtnCls}
      >
        <ChevronRight className="size-4" />
      </IconButton>

      <IconButton
        title="마지막"
        aria-label="마지막 페이지"
        onClick={goLast}
        disabled={page >= pageCount}
        className={iconBtnCls}
      >
        <ChevronsRight className="size-4" />
      </IconButton>
    </nav>
  );
}
