import api from "./axios";

/** 상품별 재고 목록 조회 */
export async function fetchProductStocks(product_id) {
  const { data } = await api.get("/v1/product-stocks/", {
    params: { product_id }
  });
  return Array.isArray(data) ? data : [];
}
