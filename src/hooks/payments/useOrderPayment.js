import { useQuery } from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";

/**
 * 내 주문 요약, orderId 가져오기 ready 상태(결제전)만 가져온다.
 *
 * @param {number} params.page - 페이지 번호        생략가능
 * @param {number} params.size - 페이지 당 아이템 개수 생략가능
 */
const getMyOrdersAPI = async () => {
  // axios의 params 옵션을 사용하면 자동으로 쿼리 스트링을 만들어줍니다.
  const response = await userApi.get("/orders/purchases/me/ready/");
  return response.data; // { count, next, previous, results } 객체를 반환
};

/**
 * 특정 주문(purchase_id)에 포함된 상품 목록을 가져오는 API 함수
 * @param {string} purchaseId - 조회할 주문의 ID
 */
const getPurchaseItemsAPI = async (purchaseId) => {
  // purchaseId가 없으면 요청을 보내지 않음
  if (!purchaseId) return null;

  // 템플릿 리터럴을 사용해 URL 경로에 purchaseId를 동적으로 삽입
  const response = await userApi.get(`/orders/purchases/${purchaseId}/items/`);
  return response.data;
};

/**
 * 내 주문 요약 ready, paid 상관 없이 가져오기
 *
 * @param {number} params.page - 페이지 번호          // 생략 가능
 * @param {number} params.size - 페이지 당 아이템 개수  // 생략 가능
 */
const getMyAllOrdersAPI = async () => {
  // axios의 params 옵션을 사용하면 자동으로 쿼리 스트링을 만들어줍니다.
  const response = await userApi.get("/orders/purchases/me/");
  return response.data; // { count, next, previous, results } 객체를 반환
};





/**
 * 내 주문 요약을 가져오는 함수
 * 
 */
export const useGetMyOrders = () => {
  return useQuery({
    // queryKey에 page와 size를 포함시켜, 페이지가 바뀔 때마다 새로운 데이터로 캐싱되도록 함
    queryKey: ["myOrders"],

    queryFn: () => getMyOrdersAPI(),

    // true이면 이전 페이지 데이터를 화면에 계속 보여주어 로딩 중 화면 깜빡임을 방지합니다.
    keepPreviousData: true,
  });
};

/**
 * 특정 주문의 상품 목록을 가져오는 useQuery 훅
 * @param {string} purchaseId - 조회할 주문의 ID
 */
export const useGetPurchaseItems = (purchaseId) => {
  return useQuery({
    queryKey: ["purchaseItems", purchaseId],

    queryFn: () => getPurchaseItemsAPI(purchaseId),

    // enabled 옵션: purchaseId가 존재할 때만 이 쿼리를 실행함
    enabled: !!purchaseId,
  });
};


/**
 * 내 주문 요약을 전부 가져오는 api (ready, paid)
 * 
 */
export const useGetMyAllOrders = () => {
  return useQuery({
    // queryKey에 page와 size를 포함시켜, 페이지가 바뀔 때마다 새로운 데이터로 캐싱되도록 함
    queryKey: ["mypageOrder"],

    queryFn: () => getMyAllOrdersAPI(),

    // true이면 이전 페이지 데이터를 화면에 계속 보여주어 로딩 중 화면 깜빡임을 방지합니다.
    keepPreviousData: true,
  });
};