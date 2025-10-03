// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { createQueryString } from "../utils/createQueryString";

// const BASE_URL = '/api/v1/products'

// async function getMockProducts() {
//   try {
//     const response = await axios.get('/api/v1/products');
//     console.log(response.data)
//     return response.data
//   } catch (error) {
//     console.error(`상품 가져오기 에러${error}`);
//     //나중에 에러처리
//   }
// }

// /**
//  * 쿼리 요청으로 상품 가져오는 api 함수
//  * @param {*} params 
//  * @returns 
//  */
// // async function getProducts(params) {
// //   try {
// //     const response = await axios.get(BASE_URL+'?'+params);
// //     console.log(response.data)
// //     return response.data
// //   } catch (error) {
// //     console.error(`상품 가져오기 에러${error}`);
// //     if(error instanceof Error){
// //       throw error
// //     }else{
// //       throw new Error(String(error));
// //     }
// //   }
// // }


// export function useProducts(params) {
  
//   const query = createQueryString(params)

//   console.log(query, '예시');
//   return useQuery({
//     queryKey: ['products', params],
//     queryFn: getMockProducts,
//     staleTime: 1000 * 60 * 5, //5분 지속

//   })
// }

// import { useQuery } from "@tanstack/react-query";
// import { dummyProduct } from "../mocks/dummyProducts";

// // 한글/영문 검색 안전하게(정규화 + 소문자)
// const norm = (s) => (s ?? "").toString().normalize("NFC").toLowerCase();

// // 정렬 도우미
// function sortItems(items, sort) {
//   switch (sort) {
//     case "created_at":
//       return [...items].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//     case "price_asc":
//       return [...items].sort((a, b) => a.price - b.price);
//     case "price_desc":
//       return [...items].sort((a, b) => b.price - a.price);
//     case "name_asc":
//       return [...items].sort((a, b) => a.name.localeCompare(b.name));
//     case "name_desc":
//       return [...items].sort((a, b) => b.name.localeCompare(a.name));
//     default:
//       return items;
//   }
// }

// export function useProducts(params = {}) {
//   const {
//     q = "",
//     category_id = null,
//     is_active = true,
//     sort = "created_at",
//     page = 1,
//     size = 20,
//   } = params;

//   return useQuery({
//     queryKey: ["products", { q, category_id, is_active, sort, page, size }],
//     queryFn: async () => {
//       let items = dummyProduct.results.slice();

//       // 판매중 필터
//       if (typeof is_active === "boolean") {
//         items = items.filter((p) => p.is_active === is_active);
//       }

//       // 카테고리 필터
//       if (category_id != null) {
//         items = items.filter((p) => p.category_id === Number(category_id));
//       }

//       // 이름 포함 검색
//       if (q && q.trim()) {
//         const term = norm(q.trim());
//         items = items.filter((p) => norm(p.name).includes(term));
//       }

//       // 정렬
//       items = sortItems(items, sort);

//       // 페이지네이션
//       const count = items.length;
//       const start = (page - 1) * size;
//       const results = items.slice(start, start + size);

//       // (선택) 네트워크 흉내
//       // await new Promise((r) => setTimeout(r, 120));

//       return { count, results };
//     },
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000,
//   });
// }

import { useQuery } from "@tanstack/react-query";
import { fetchProductsPublic } from "../components/common/api/admin/productsPublic";

export function useProducts(params = {}, options = {}) {
  const {
    q = "",
    category_id = null,
    is_active = true,
    sort = "-created_at",
    page = 1,
    size = 20,
    min_price,
    max_price,
  } = params;

  const { enabled = true } = options;

  return useQuery({
    queryKey: ["products-public", { q, category_id, is_active, sort, page, size, min_price, max_price }],
    queryFn: () => fetchProductsPublic({ q, category_id, is_active, sort, page, size, min_price, max_price }),
    enabled,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
}
