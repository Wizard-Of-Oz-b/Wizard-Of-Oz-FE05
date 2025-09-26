/**
 * 내 주문 목록에서 특정상태만 거르는
 * @param {Array} orderResult - 주문 검색 결과
 * @param {string} status  - ready, paid 등 주문 상태 필터링
 */
export const filterOrders = (orderResult, status) => {

  if (!Array.isArray(orderResult) || !status) {
    return [];
  }
  const filteredResult = orderResult.filter((el) => el.status === status);
  return filteredResult;

};