import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createQueryString } from "../utils/createQueryString";

async function getProducts() {
  try {
    const response = await axios.get('/api/v1/products');
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`상품 가져오기 에러${error}`);
    //나중에 에러처리
  }
}

export function useProducts(params) {
  
  const query = createQueryString(params)
  
  console.log(query, '예시');
  return useQuery({
    queryKey: ['products', params],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, //5분 지속

  })
}