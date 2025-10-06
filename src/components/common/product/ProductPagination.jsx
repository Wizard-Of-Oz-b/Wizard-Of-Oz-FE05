import { useMemo } from "react";

export default function ProductPagination({
  currentPage,
  totalPage,
  onPageChange,
}) {
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPage }, (_, i) => i + 1),
    [totalPage]
  );

  return (
    <div className="flex justify-center space-x-2">
      {/* '이전' 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-2xl disabled:opacity-50 cursor-pointer hover:bg-neutral-50"
      >
        이전
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 border rounded-2xl cursor-pointer hover:bg-violet-700 hover:text-neutral-50 delay-75
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
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="px-4 py-2 border rounded-2xl disabled:opacity-50 cursor-pointer hover:bg-neutral-50"
      >
        다음
      </button>
    </div>
  );
}
