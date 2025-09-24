// import axios from "axios";
import { createQueryString } from "../../utils/createQueryString";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../../lib/axios";

const BASE_URL = "/api/v1";

async function getCartData() {
  try {
    const response = await api.get(`/carts/me`);
    // const response = await axios.get(`${BASE_URL}/me`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`카트 가져오기 에러${error}`);
    //나중에 에러처리
  }
}

//patchCartData
async function patchCartData({ id, updatedData }) {
  try {
    console.log(updatedData, "패치 테스트");
    // return  await axios.patch(`${BASE_URL}/items/${id}`, updatedData)
    return await api.patch(`${BASE_URL}/carts/items/${id}`, updatedData);
  } catch (error) {
    console.error(`카트 업로드 실패${error}`);
    throw error;
  }
}

//deleteCartItem
async function deleteCartItem({ productId, optionKey }) {
  try {
    const queryString = `option_key=${encodeURIComponent(optionKey)}`;
    // const response = await axios.delete(`${BASE_URL}/items/by-product/${productId}?${queryString}`)
    const response = await api.delete(
      `${BASE_URL}/carts/items/by-product/${productId}?${queryString}`
    );
    return response.data;
  } catch (error) {
    console.error(`카트 아이템 삭제 실패${error}`);
    throw error;
  }
}

export function useCart(params) {
  const query = createQueryString(params);
  console.log(query);

  return useQuery({
    queryKey: ["userCart", params],
    queryFn: getCartData,
    staleTime: 0,
  });
}

export function usePatchCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchCartData,
    onSuccess: () => {
      //성공하면 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },
    onError: (error) => {
      //에러처리
      console.error(error);
    },
  });
}

export function useDeleteCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      //성공하면 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },
    onError: (error) => {
      //에러처리
      console.error(error);
    },
  });
}
