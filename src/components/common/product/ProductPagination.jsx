export default function ProductPagination({currentPage, totalPage}) {

	return(
		<div className="flex items-center justify-center">
			<button>이전</button>
			<span>{currentPage}/{totalPage}</span>
			<button>다음</button>
		</div>

	)
}