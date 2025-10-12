import { useMemo } from "react";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { IconButton } from "../layouts/admin/products";

export default function ProductPagination({
  currentPage,
  totalPage,
  onPageChange,
  maxPage = 5,
}) {
  const pageNumbers = useMemo(() => {
    // 최대 페이지(5) 보다 작으면 전부 출력
    const halfPage = Math.floor(maxPage / 2); //

    if (totalPage <= maxPage) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    let startPage = currentPage - halfPage;
    let endPage = currentPage + halfPage;

    // 1보다 작은 5페이지 최대에서느 currentpage가 2일때까지 적용
    if (startPage < 1) {
      startPage = 1;
      endPage = maxPage;
    }
    // totalpage가 커질 경우
    if (endPage > totalPage) {
      endPage = totalPage;
      startPage = totalPage - maxPage + 1;
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [totalPage, currentPage, maxPage]);

  return (
    <div className="flex justify-center space-x-2">
      {/* '이전' 버튼 */}
      <IconButton
        title="이전"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronLeft className="size-4" />
      </IconButton>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`h-9 w-9 p-0 rounded-full border border-gray-200 text-gray-600 cursor-pointer hover:bg-violet-700  hover:text-neutral-50 delay-75
            ${
              currentPage === number
                ? "bg-violet-400 text-neutral-50"
                : "bg-white"
            }`} // 현재 페이지 강조 스타일
        >
          {number}
        </button>
      ))}

      {/* '다음' 버튼 */}
      <IconButton
        title="다음"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700 cursor-pointer disabled:cursor-not-allowed"
      >
        <ChevronRight className="size-4" />
      </IconButton>
    </div>
  );
}
