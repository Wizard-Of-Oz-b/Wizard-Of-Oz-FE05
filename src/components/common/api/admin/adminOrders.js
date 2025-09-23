import api from "../../../../lib/axios";

const API_PREFIX = "/v1";

// 관리자: 주문 목록
export async function fetchAdminOrders(params = {}) {
  const res = await api.get(`${API_PREFIX}/admin/orders/`, { params });
  const data = res.data;
  if (Array.isArray(data)) return { results: data, count: data.length };
  return { results: data.results || [], count: data.count ?? (data.results?.length || 0) };
}

// 관리자: 주문 단건 조회
export async function fetchAdminOrder(purchaseId) {
  const res = await api.get(`${API_PREFIX}/admin/orders/${purchaseId}/`);
  return res.data;
}

// 주문 품목 목록
export async function fetchOrderItems(purchaseId, params = {}) {
  const res = await api.get(`${API_PREFIX}/orders/purchases/${purchaseId}/items/`, { params });
  const data = res.data;
  if (Array.isArray(data)) return { results: data, count: data.length };
  return { results: data.results || [], count: data.count ?? (data.results?.length || 0) };
}

// 공용헬퍼함수
async function _tryPatchCancelRefund(kind, id) {
  const url = `${API_PREFIX}/admin/orders/${id}/${kind}/`;
  const res = await api.patch(url);
  return res.data; // { id, status }
}

/**
 * 취소 요청
 */
export async function cancelAdminOrder(orderOrPurchaseId, items = []) {
  try {
    return await _tryPatchCancelRefund("cancel", orderOrPurchaseId);
  } catch (e1) {
    const fallback = items.find((it) => it?._meta?.order_id)?._meta?.order_id;
    if (!fallback) throw e1;
    return await _tryPatchCancelRefund("cancel", fallback);
  }
}

/**
 * 환불 요청
 */
export async function refundAdminOrder(orderOrPurchaseId, items = []) {
  try {
    return await _tryPatchCancelRefund("refund", orderOrPurchaseId);
  } catch (e1) {
    const fallback = items.find((it) => it?._meta?.order_id)?._meta?.order_id;
    if (!fallback) throw e1;
    return await _tryPatchCancelRefund("refund", fallback);
  }
}