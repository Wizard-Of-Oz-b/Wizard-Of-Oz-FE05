const TERMINAL_STATUSES = ["배송완료", "취소완료", "환불완료"];

/**
 * 운송장 입력에 따른 주문 상태 전환 규칙
 * @param {string} current 현재 상태
 * @param {string} carrier 택배사
 * @param {string} trackingNo 운송장 번호
 * @returns {string} 변경된 상태
 */
export function getNextStatus(current, carrier, trackingNo) {
  if (TERMINAL_STATUSES.includes(current)) return current;

  const hasCarrier = carrier.trim() !== "";
  const hasTracking = trackingNo.trim() !== "";

  if (hasCarrier && hasTracking) return "배송중";

  if (hasCarrier && !hasTracking && ["주문접수", "결제완료"].includes(current)) {
    return "상품준비";
  }

  return current;
}
