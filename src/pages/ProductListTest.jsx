import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/common/product/ProductList";


// 해당 컴포넌트는 상품 리스트를 불러 오는 방법의 예시 이니 참고 바랍니다.
export default function ProductListTest () {

  // 쿼리 필수 값은 없다. 필요 없는건 선언을 안해도 되고 null, '' 값으로 지정해두면 된다.
  const [query, setQuery] = useState({
    q:'',   //검색값
    category_id: null,  //카테고리 id
    is_active: true,    //판매중
    sort: 'created_at', //정렬 기준
    page: 1,            //페이지
    size: 20            //한 페이지에 몇개 결과 가져올지
  })
  // console.log(query)

  //tanStack 쿼리
  const { data: products, isLoading, isError, error } = useProducts(query);
  console.log(products, '프로덕트')
  const handleSortChange = (sortValue) =>{
    setQuery(prev => ({...prev, sort: sortValue, page:1}))
  }
  const handlePageChange = (pageNum) => {
    setQuery(prev => ({ ...prev, page: pageNum }));
  }

  //임시 에러
  if(isError){
    return(<>
      {error}
    </>)
  }




  return(
  <>
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl">테스트 제목</h1>
      <h2> 카테고리 위치</h2>
    </div>
    <ProductList
    datas={products} 
    isLoading={isLoading} 
    query={query} 
    onSortChange={handleSortChange}
    onPageChange={handlePageChange}
    />
  </>
  
)
}