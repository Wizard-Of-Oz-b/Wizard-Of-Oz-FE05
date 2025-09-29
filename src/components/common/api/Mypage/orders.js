import api from "../../../../lib/axios";


// 내 주문 내역 조회
export const getMyPurchases = () => api.get("/v1/purchases/me");

// 주문 취소
export const cancelPurchase = (data) =>
  api.post(`/v1/purchases/${data.order_item_id}/cancel`, data);
