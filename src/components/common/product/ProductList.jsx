// import ProductCard from "./ProductCard";
// import ProductDropDown from "./ProductDropDown";
// import ProductPagination from "./ProductPagination";

// export default function ProductList({datas, isLoading, query, onSortChange, onPageChange}){

//   //임시 로딩 차후 스켈레톤 추가
//   if(isLoading){
//     return(<>
//       로딩....
//     </>)
//   }
	
//   console.log(datas , '데이터 테스트')
//   const totalPage = Math.ceil(datas.count/query.size)

//   return(
//   <div className="w-dvw flex items-center justify-center">

//     <div className="w-3/4">
// 			<div className="flex items-center justify-between">
// 				<p className="font-medium text-lg">{`결과: ${datas.count}개`}</p>
// 				<ProductDropDown
// 					currentSort={query?.sort}
// 					onSortChange={onSortChange}
// 				/>
// 				{/* <p className="font-medium">정렬 기준</p> */}
// 			</div>

// 			<div className="flex flex-wrap items-start  pt-5">
// 				{datas?.results.map((el)=> <ProductCard key={el.product_id} data={el}/>)}
// 			</div>
// 			<ProductPagination 
// 				currentPage={query.page}
// 				totalPage={totalPage}
// 				onPageChange={onPageChange}
// 			/>
//     </div>

//   </div>

//   )
// }

import ProductCard from "./ProductCard";
import ProductDropDown from "./ProductDropDown";
import ProductPagination from "./ProductPagination";

export default function ProductList({
  datas,
  isLoading,
  query,
  onSortChange,
  onPageChange,
}) {
  const count = datas?.count ?? 0;
  const results = Array.isArray(datas?.results) ? datas.results : [];

  const pageSize = Number(query?.size) > 0 ? Number(query.size) : 20;
  const totalPage = Math.max(1, Math.ceil(count / pageSize));

  const keyOf = (p) =>
    p?.id ??
    p?.uuid ??
    p?.product_id ??
    p?.sku ??
    p?.slug ??
    p?.code ??
    p?.pk ??
    Math.random().toString(36).slice(2);

  if (isLoading) return <>로딩....</>;

  if (!results.length) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-6xl px-4 overflow-x-hidden">
          <div className="flex items-center justify-between">
            <p className="font-medium text-lg">{`결과: 0개`}</p>
            <ProductDropDown currentSort={query?.sort} onSortChange={onSortChange} />
          </div>
          <div className="pt-8 text-center text-slate-500">
            조건에 맞는 상품이 없어요.
          </div>
          <ProductPagination
            currentPage={query?.page ?? 1}
            totalPage={totalPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-6xl px-4 overflow-x-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium text-lg">{`결과: ${count}개`}</p>
          <ProductDropDown currentSort={query?.sort} onSortChange={onSortChange} />
        </div>

        <div className="-mx-2 flex flex-wrap items-start pt-5">
          {results.map((item) => (
            <ProductCard key={keyOf(item)} data={item} />
          ))}
        </div>

        <ProductPagination
          currentPage={query?.page ?? 1}
          totalPage={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
