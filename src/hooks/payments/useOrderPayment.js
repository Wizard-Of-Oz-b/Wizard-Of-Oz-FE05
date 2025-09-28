import { useQuery } from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";

/**
 * 내 주문 목록을 페이지네이션으로 가져오는 API 함수
 *
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 당 아이템 개수
 */
const getMyOrdersAPI = async ({ page, size }) => {
  // axios의 params 옵션을 사용하면 자동으로 쿼리 스트링을 만들어줍니다.
  const response = await userApi.get("/orders/purchases/me/ready/", {
    params: { page, size },
  });
  return response.data; // { count, next, previous, results } 객체를 반환
};

/**
 * 내 주문 목록을 페이지네이션으로 가져오는 useQuery 훅
 *
 * @param {number} params.page - 페이지 번호
 * @param {number} params.size - 페이지 당 아이템 개수
 */
export const useGetMyOrders = ({ page, size }) => {
  return useQuery({
    // queryKey에 page와 size를 포함시켜, 페이지가 바뀔 때마다 새로운 데이터로 캐싱되도록 함
    queryKey: ["myOrders", { page, size }],

    queryFn: () => getMyOrdersAPI({ page, size }),

    // true이면 이전 페이지 데이터를 화면에 계속 보여주어 로딩 중 화면 깜빡임을 방지합니다.
    keepPreviousData: true,
  });
};


