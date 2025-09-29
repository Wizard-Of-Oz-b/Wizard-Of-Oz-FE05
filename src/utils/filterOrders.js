/**
 * 내 주문 목록에서 특정상태만 거르는 + 0원인 상품 거르기
 * @param {Array} orderResult - 주문 검색 결과
 * @param {string} status  - ready, paid 등 주문 상태 필터링
 */
export const filterOrders = (orderResult) => {
  if (!Array.isArray(orderResult)) {
    return [];
  }
  const filteredResult = orderResult.filter(
    (el) =>  el.unit_price !== "0.00"
  );
  return filteredResult;
};
