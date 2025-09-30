import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApi from "../../lib/api/userAxios";

// 주문 정보 상세 출력
/**
 *
 * @param {String} purchaseId 구매 아이디
 * @returns {object} 구매목록
 */
const getPurchaseAPI = async (purchaseId) => {
  // purchaseId가 없으면 요청을 보내지 않도록 방어
  if (!purchaseId) return null;

  const response = await userApi.get(`/orders/purchases/${purchaseId}/items/`);
  return response.data;
};

// 배송정보 가져오기
const getShipmentInfoAPI = async (orderId) => {
  // orderId가 없으면 요청을 보내지 않음
  if (!orderId) return null;

  const response = await userApi.get("/shipments/", {
    params: {
      order_id: orderId,
    },
  });
  return response.data;
};

// 주문 취소
const cancelPurchaseAPI = async (purchaseId) => {
  const response = await userApi.patch(
    `/orders/purchases/${purchaseId}/cancel/`);
  return response.data;
};

export const useGetPurchaseDetail = (purchaseId) => {
  return useQuery({
    queryKey: ["purchaseDetail", purchaseId],
    queryFn: () => getPurchaseAPI(purchaseId),
    enabled: !!purchaseId,
  });
};

export const useGetShipmentInfo = (orderId) => {
  return useQuery({
    queryKey: ["shipmentInfo", orderId],

    queryFn: () => getShipmentInfoAPI(orderId),
    enabled: !!orderId,
  });
};

export const useCancelPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPurchaseAPI,

    onSuccess: () => {
      // 마이페이지 주문 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["mypageOrder"] });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.detail || "주문 취소 중 오류가 발생했습니다.";
      console.error("주문 취소 실패:", error , errorMessage);

    },
  });
};
