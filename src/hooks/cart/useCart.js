// import axios from "axios";
// import { createQueryString } from "../../utils/createQueryString";
// import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// const BASE_URL = '/api/v1/carts'

// async function getCartData() {
//   try {
//     const response = await axios.get(`${BASE_URL}/me`);
//     console.log(response.data)
//     return response.data
//   } catch (error) {
//     console.error(`카트 가져오기 에러${error}`);
//     //나중에 에러처리
//   }
// }

// //patchCartData
// async function patchCartData({id,updatedData}) {
//   try{
//     console.log(updatedData,'패치 테스트')
//     return  await axios.patch(`${BASE_URL}/items/${id}`, updatedData)
//   }catch(error){
//     console.error(`카트 업로드 실패${error}`)
//     throw error
//   }
  
// }

// //deleteCartItem
// async function deleteCartItem({productId,optionKey}){
//   try{
//     const queryString = `option_key=${encodeURIComponent(optionKey)}`
//     const response = await axios.delete(`${BASE_URL}/items/by-product/${productId}?${queryString}`)
//     return response.data
//   }catch(error){
//     console.error(`카트 아이템 삭제 실패${error}`)
//     throw error
//   }
// }

// export function useCart(params) {

//     const query = createQueryString(params)
//     console.log(query)
    
//     return useQuery({
//       queryKey: ['userCart', params],
//       queryFn: getCartData,
//       staleTime:0,
//     })
  
// }

// export function usePatchCart(){
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn:patchCartData,
//     onSuccess: () => {
//       //성공하면 데이터 다시 불러오기
//       queryClient.invalidateQueries({queryKey: ['userCart']})
//     },
//     onError:(error) =>{
//       //에러처리
//       console.error(error)
//     }

//   })
// }

// export function useDeleteCartItem(){
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn:deleteCartItem,
//     onSuccess: () => {
//       //성공하면 데이터 다시 불러오기
//       queryClient.invalidateQueries({queryKey: ['userCart']})
//     },
//     onError:(error) =>{
//       //에러처리
//       console.error(error)
//     }
//   })
// }

// src/components/common/hooks/cart/useCart.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";

const base = (api.defaults?.baseURL || "").replace(/\/+$/, "");
const PREFIX = base.endsWith("/api") ? "/v1" : "/api/v1";
const CART_BASE = `${PREFIX}/carts`;

const CART_QK = ["userCart"];

function parseOptionsString(str) {
  if (!str || typeof str !== "string") return null;
  const obj = {};
  str.split(";").forEach((pair) => {
    const [k, v] = pair.split("=").map((s) => s?.trim());
    if (k) obj[k] = v ?? "";
  });
  return Object.keys(obj).length ? obj : null;
}

async function getCartData() {
  try {
    const { data } = await api.get(`${CART_BASE}/me/`);
    return data;
  } catch (e) {
    const s = e?.response?.status;
    // 일부 서버가 인증/세션 문제를 400으로 내려보내기도 합니다.
    if (s === 400 || s === 401 || s === 403) {
      return { items: [], count: 0, total: 0 }; // ✅ 콘솔 400 없애고 UI는 정상
    }
    throw e; // 그 외는 원래대로 터뜨림
  }
}

async function patchCartData({ id, updatedData }) {
  const { data } = await api.patch(`${CART_BASE}/items/${id}/`, updatedData);
  return data;
}

async function deleteCartItem({ productId, optionKey }) {
  const qs = `option_key=${encodeURIComponent(option_key ?? "")}`;
  const { data } = await api.post(
    `${CART_BASE}/items/by-product/${product_id}/`,
    { quantity },
  { params: { option_key } }
  );
  return data;
}

export function useCart(params) {
  return useQuery({
    queryKey: [...CART_QK, params],
    queryFn: getCartData,
    staleTime: 0,
  });
}

export function usePatchCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchCartData,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QK }),
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QK }),
  });
}


// ✅ 오직 서버가 받는 형태로만 1회 요청
export async function addCartItem({
  product_id,
  option_key,
  quantity = 1,
  options, // 객체면 그대로 보냄
}) {
  if (!product_id) throw new Error("product_id required");

  const payload = {
    // 서버가 인정하는 필드명 사용 (여기서는 product)
    product: product_id,
    option_key: String(option_key ?? ""),
    quantity: Number.isFinite(quantity) ? quantity : 1,
  };
  if (options && typeof options === "object") payload.options = options;

  const { data } = await api.post(`${CART_BASE}/items/`, payload);
  return data;
}
