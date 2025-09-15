import ProductCard from "./ProductCard";
import ProductDropDown from "./ProductDropDown";
import ProductPagination from "./ProductPagination";

export default function ProductList({datas, isLoading, query, onSortChange, onPageChange}){

  //임시 로딩 차후 스켈레톤 추가
  if(isLoading){
    return(<>
      로딩....
    </>)
  }
  console.log(datas , '데이터 테스트')
  const totalPage = Math.ceil(datas.count/query.size)

  return(
  <div className="w-dvw flex items-center justify-center">

    <div className="w-3/4">
			<div className="flex items-center justify-between">
				<p className="font-medium text-lg">{`결과: ${datas.total}개`}</p>
				<ProductDropDown
					currentSort={query?.sort}
					onSortChange={onSortChange}
				/>
				{/* <p className="font-medium">정렬 기준</p> */}
			</div>

			<div className="flex flex-wrap items-start  pt-5">
				{datas?.results.map((el)=> <ProductCard key={el.product_id} data={el}/>)}
			</div>
			<ProductPagination 
				currentPage={datas.page}
				totalPage={totalPage}
				onPageChange={onPageChange}
			/>
    </div>

  </div>

  )
}