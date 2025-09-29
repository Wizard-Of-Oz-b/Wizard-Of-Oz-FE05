import { useQuery } from "@tanstack/react-query";
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

export const useGetPurchaseDetail = (purchaseId) => {
  return useQuery({
    queryKey: ['purchaseDetail', purchaseId],
    queryFn: () => getPurchaseAPI(purchaseId),
    enabled: !!purchaseId
  });
};
