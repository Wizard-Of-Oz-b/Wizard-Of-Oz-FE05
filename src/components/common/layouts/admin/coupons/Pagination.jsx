import IconButton from "../common/IconButton";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export default function Pagination({ page, pageCount, goFirst, goPrev, goNext, goLast }) {
  return (
    <div className="mt-6 flex justify-center items-center gap-2">
      <IconButton
        title="첫 페이지"
        onClick={goFirst}
        disabled={page <= 1}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="size-4" />
      </IconButton>

      <IconButton
        title="이전"
        onClick={goPrev}
        disabled={page <= 1}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4" />
      </IconButton>

      <span className="px-2 text-sm font-medium tabular-nums select-none">
        <span className="font-semibold text-violet-700">페이지 {page}</span> / {pageCount}
      </span>

      <IconButton
        title="다음"
        onClick={goNext}
        disabled={page >= pageCount}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4" />
      </IconButton>

      <IconButton
        title="마지막"
        onClick={goLast}
        disabled={page >= pageCount}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="size-4" />
      </IconButton>
    </div>
  );
}
