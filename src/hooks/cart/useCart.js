// import axios from "axios";
import { createQueryString } from "../../utils/createQueryString";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";

// const BASE_URL = "/api/v1";
const BASE_URL = import.meta.env.VITE_API_BASE + '/v1'
async function getCartData() {
  try {
    console.log(BASE_URL)

    const response = await userApi.get(`/carts/me`);
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
    return await userApi.patch(`/carts/items/${id}/update/`, updatedData);
  } catch (error) {
    console.error(`카트 업로드 실패${error}`);
    throw error;
  }
}

//deleteCartItem
async function deleteCartItem({ productId, optionKey }) {
  try {
    // const response = await axios.delete(`${BASE_URL}/items/by-product/${productId}?${queryString}`)
    const response = await userApi.delete(
      `/carts/items/by-product/${productId}/`,
      {
        params: {
          option_key: optionKey
        }
      }
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
