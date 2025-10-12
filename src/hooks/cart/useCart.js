// import axios from "axios";
import { createQueryString } from "../../utils/createQueryString";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";
import { useCartCount } from "../../store/cartCount"; // 추가

// const BASE_URL = "/api/v1";
const BASE_URL = import.meta.env.VITE_API_BASE + "/v1";
async function getCartData() {
  try {
    console.log(BASE_URL);

    const response = await userApi.get(`/carts/me/`);
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
          option_key: optionKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`카트 아이템 삭제 실패${error}`);
    throw error;
  }
}

async function clearCartAPI() {
  // 이 요청은 별도의 body나 파라미터가 필요 없습니다.
  const response = await userApi.delete("/carts/clear/");
  useCartCount.getState().set(0);
  return response.data;
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
    // onSuccess: () => {
    //   //성공하면 데이터 다시 불러오기
    //   queryClient.invalidateQueries({ queryKey: ["userCart"] });
    // },
    onSuccess: (_data, variables) => {
      useCartCount.getState().dec(variables?.quantity ?? 1)
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },
    onError: (error) => {
      //에러처리
      console.error(error);
    },
  });
}

/**
 * 장바구니 전체 비우기 useMutation 훅
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCartAPI,

    onSuccess: () => {
      console.log("장바구니를 성공적으로 비웠습니다.");
      queryClient.invalidateQueries({ queryKey: ["userCart"] });
    },

    onError: (error) => {
      // 차후 모달창으로 변경 할것
      console.error("장바구니 비우기 실패:", error);
      alert("장바구니를 비우는 중 오류가 발생했습니다.");
    },
  });
};
