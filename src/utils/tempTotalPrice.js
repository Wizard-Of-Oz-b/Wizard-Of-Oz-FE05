/**
 * 임시로 가격 합산
 * 추후에 제거 예정
 */
export default function tempTotalPrice(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return 0;
  }

  return data.reduce((total, item) => {
    const itemPrice = Number(item.unit_price) * item.amount;

    return total + itemPrice;
  }, 0);
}
