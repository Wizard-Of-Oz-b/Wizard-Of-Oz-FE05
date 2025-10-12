import { useQuery } from "@tanstack/react-query";
import api from "../../../../../lib/axios";

const ALLOWED_STATUSES = ["paid", "delivered", "completed"];

async function checkEligibility(productId) {
  if (!productId) return { eligible: false, reason: "no_product" };
  const hasToken =
    !!localStorage.getItem("access_token") ||
    !!sessionStorage.getItem("access_token");
  if (!hasToken) return { eligible: false, reason: "guest" };

  // 1) 내 구매 목록을 조회합니다.
  const { data } = await api.get("/v1/orders/purchases/me/", {
    params: { page: 1, size: 50 },
  });
  const list = Array.isArray(data?.results) ? data.results : [];

  // purchases/me에 product 필드가 있을 경우 바로 읽어옴
  const quickHit = list.some(
    (p) =>
      String(p?.product) === String(productId) &&
      (p?.status ? ALLOWED_STATUSES.includes(String(p.status)) : true)
  );
  if (quickHit) return { eligible: true };

  // 상위 몇 건 items 조회해서 product_id 매칭 확인
  const candidates = list
    .filter((p) => (p?.status ? ALLOWED_STATUSES.includes(String(p.status)) : true))
    .slice(0, 5);

  for (const p of candidates) {
    const purchaseId = p?.purchase_id || p?.id;
    if (!purchaseId) continue;
    try {
      const resp = await api.get(`/v1/orders/purchases/${purchaseId}/items/`, {
        params: { product_id: productId, size: 1 },
      });
      const items = resp?.data;
      const found =
        (Array.isArray(items?.results) && items.results.length > 0) ||
        (Array.isArray(items) && items.length > 0);
      if (found) return { eligible: true };
    } catch {
    }
  }

  return { eligible: false, reason: "no_purchase" };
}

export function useReviewEligibility(productId, options = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ["review-eligibility", productId],
    queryFn: () => checkEligibility(String(productId)),
    enabled: !!productId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
