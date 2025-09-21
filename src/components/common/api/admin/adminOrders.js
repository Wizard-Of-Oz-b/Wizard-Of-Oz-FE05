import api from "../../../../lib/axios";

// 관리자: 주문 목록
export async function fetchAdminOrders(params = {}) {
  const res = await api.get("/v1/admin/orders/", { params });
  const data = res.data;
  if (Array.isArray(data)) return { results: data, count: data.length };
  return { results: data.results || [], count: data.count ?? (data.results?.length || 0) };
}

// 관리자: 주문 단건 조회
export async function fetchAdminOrder(purchaseId) {
  const res = await api.get(`/v1/admin/orders/${purchaseId}/`);
  return res.data;
}

// 주문 품목 목록
export async function fetchOrderItems(purchaseId, params = {}) {
  const res = await api.get(`/v1/orders/purchases/${purchaseId}/items/`, { params });
  const data = res.data;
  if (Array.isArray(data)) return { results: data, count: data.length };
  return { results: data.results || [], count: data.count ?? (data.results?.length || 0) };
}

// 관리자: 취소/환불
export async function cancelAdminOrder(orderId) {
  const res = await api.patch(`/v1/admin/orders/${orderId}/cancel/`);
  return res.data; // { id, status }
}
export async function refundAdminOrder(orderId) {
  const res = await api.patch(`/v1/admin/orders/${orderId}/refund/`);
  return res.data; // { id, status }
}
