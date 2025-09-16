import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createQueryString } from "../utils/createQueryString";

const BASE_URL = '/api/v1/products'

async function getMockProducts() {
  try {
    const response = await axios.get('/api/v1/products');
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`상품 가져오기 에러${error}`);
    //나중에 에러처리
  }
}

async function getProducts(params) {
  try {
    const response = await axios.get(BASE_URL+'?'+params);
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`상품 가져오기 에러${error}`);
    if(error instanceof Error){
      throw error
    }else{
      throw new Error(String(error));
    }
  }
}


export function useProducts(params) {
  
  const query = createQueryString(params)

  console.log(query, '예시');
  return useQuery({
    queryKey: ['products', params],
    queryFn: getMockProducts,
    staleTime: 1000 * 60 * 5, //5분 지속

  })
}