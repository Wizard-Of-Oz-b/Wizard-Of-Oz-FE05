import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductList from "../components/common/product/ProductList";

export default function ProductListTest () {

  // 필수 값은 없다.
  const [query, setQuery] = useState({
    q:'',
    category_id: null,
    is_active: true,
    sort: 'created_at',
    page: 1,
    size: 20
  })
  console.log(query)


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