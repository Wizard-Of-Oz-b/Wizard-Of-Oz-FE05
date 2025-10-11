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


//merge 한 상품이 중복된 상품이어도 따로 분리되어서 출력되고 있어서 새롭게 만든 함수

export const mergeDuplicateOrders = (orderResult) => {
  if(!Array.isArray(orderResult) || orderResult.length === 0){
    return [];
  }

  const mergeOrder = orderResult.reduce((acc, cur) => {
    const key = `${cur.product_id}_${cur.option_key}`

    if(acc[key]){
      acc[key].quantity += cur.quantity;
      acc[key].line_total += cur.line_total
    }else{
      acc[key] ={...cur};
    }

    return acc

  }, {})

  return Object.values(mergeOrder);
}