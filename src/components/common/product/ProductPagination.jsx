import { useMemo } from "react";

export default function ProductPagination({currentPage, totalPage , onPageChange}) {

	const pageNumbers = useMemo(()=> Array.from({length: totalPage}, (_,i) => i+1), [totalPage]) ;

	return(
		    <div className="flex justify-center space-x-2"> 
      {/* '이전' 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md disabled:opacity-50"
      >
        이전
      </button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 border rounded-md 
            ${currentPage === number ? 'bg-violet-600 text-white' : 'bg-white'}`} // 현재 페이지 강조 스타일
        >
          {number}
        </button>
      ))}

      {/* '다음' 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="px-4 py-2 border rounded-md disabled:opacity-50"
      >
        다음
      </button>
    </div>
	)
}